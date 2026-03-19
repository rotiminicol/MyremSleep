import fs from 'fs';
import path from 'path';

const replacements = {
  'internal': 'internal',
  'interpolation': 'interpolation',
  'interactivity': 'interactivity',
  'pointer': 'pointer',
  'interface': 'interface',
  'interval': 'interval',
  'setinterval': 'setInterval',
  'clearinterval': 'clearInterval',
  'Winter': 'Winter',
  'winter': 'winter',
  'Pinterest': 'Pinterest',
  'internet': 'internet',
  'DatabaseWithoutinternals': 'DatabaseWithoutInternals',
  'internationally': 'internationally',
  'international': 'international',
  'interact': 'interact',
  'interests': 'interests'
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  for (const [bad, good] of Object.entries(replacements)) {
    content = content.split(bad).join(good);
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed: ' + filePath);
  }
}

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (['node_modules', '.git', 'dist', '.gemini'].includes(file)) continue;
      traverse(fullPath);
    } else {
      if (/\.(tsx|ts|html|css|js|json)$/.test(file)) {
        processFile(fullPath);
      }
    }
  }
}

try {
  traverse('.');
  console.log('Done restoring inter occurrences.');
} catch (e) {
  console.error(e);
}
