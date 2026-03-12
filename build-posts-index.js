// Auto-generates posts/posts-index.json from all .md files in posts/
const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'posts');
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

const posts = [];

files.forEach(filename => {
  const content = fs.readFileSync(path.join(postsDir, filename), 'utf8');
  const fm = {};
  
  // Parse frontmatter
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (match) {
    match[1].split('\n').forEach(line => {
      const idx = line.indexOf(':');
      if (idx > -1) {
        const key = line.slice(0, idx).trim();
        const val = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
        fm[key] = val;
      }
    });
  }

  if (fm.title) {
    posts.push({
      slug: filename.replace('.md', ''),
      title: fm.title,
      date: fm.date ? fm.date.substring(0, 10) : '',
      category: fm.category || '',
      summary: fm.summary || '',
      image: fm.image || ''
    });
  }
});

// Sort by date descending
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync(
  path.join(postsDir, 'posts-index.json'),
  JSON.stringify(posts, null, 2)
);

console.log(`Built posts-index.json with ${posts.length} posts:`);
posts.forEach(p => console.log(` - ${p.title}`));
