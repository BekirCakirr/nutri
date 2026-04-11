const fs = require('fs');
const path = require('path');

function findTsx(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules') {
      results = results.concat(findTsx(full));
    } else if (entry.name.endsWith('.tsx')) {
      results.push(full);
    }
  }
  return results;
}

const files = findTsx('mobile/src/screens');
let fixedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Check if file has inner ScrollView or FlatList
  const hasInnerScroll = /<ScrollView|<FlatList/.test(content);
  if (!hasInnerScroll) continue;

  // Check if ScreenWrapper already has scrollable={false}
  const wrapperMatch = content.match(/<ScreenWrapper([^>]*?)>/);
  if (!wrapperMatch) continue;

  const wrapperProps = wrapperMatch[1];
  if (/scrollable\s*=\s*\{?\s*false/.test(wrapperProps)) continue;

  // Has inner scroll but ScreenWrapper doesn't have scrollable={false}
  // Add scrollable={false} to ScreenWrapper

  const original = content;

  // Pattern 1: <ScreenWrapper> (no props)
  content = content.replace(/<ScreenWrapper>/, '<ScreenWrapper scrollable={false}>');

  // Pattern 2: <ScreenWrapper padded={false}> or <ScreenWrapper padded={false} other>
  // Only if scrollable is not already there
  if (content === original) {
    content = content.replace(
      /<ScreenWrapper(\s+(?!scrollable)[^>]*?)>/,
      '<ScreenWrapper scrollable={false}$1>'
    );
  }

  // Pattern 3: <ScreenWrapper scrollable keyboardAvoiding> — has scrollable without value
  if (content === original) {
    content = content.replace(
      /<ScreenWrapper\s+scrollable\b/,
      '<ScreenWrapper scrollable={false}'
    );
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    fixedCount++;
    console.log(`Fixed: ${path.relative('.', file)}`);
  }
}

console.log(`---`);
console.log(`Total nested scroll fixes: ${fixedCount}`);
