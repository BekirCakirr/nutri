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
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      results.push(full);
    }
  }
  return results;
}

// Map Tailwind TODO classes to RN style properties
const todoMap = {
  'bg-white min-h-[120px]': "backgroundColor: '#FFFFFF', minHeight: 120",
  'bg-amber-50 border-amber-200': "backgroundColor: '#FFFBEB', borderColor: '#FDE68A'",
  'bg-white/70': "backgroundColor: 'rgba(255,255,255,0.7)'",
  'bg-white/20': "backgroundColor: 'rgba(255,255,255,0.2)'",
  'bg-white/10': "backgroundColor: 'rgba(255,255,255,0.1)'",
  'bg-white': "backgroundColor: '#FFFFFF'",
  'bg-black/40': "backgroundColor: 'rgba(0,0,0,0.4)'",
  'border-white/30': "borderColor: 'rgba(255,255,255,0.3)'",
  'border-4 border-white': "borderWidth: 4, borderColor: '#FFFFFF'",
  'w-3.5 h-3.5 bg-emerald-500 border-white': "width: 14, height: 14, backgroundColor: '#10B981', borderColor: '#FFFFFF'",
  'w-2.5 h-2.5': 'width: 10, height: 10',
  'min-w-[100px]': 'minWidth: 100',
  'mx-[1.5%]': "marginHorizontal: '1.5%'",
  'rounded': 'borderRadius: 6',
  'self-stretch': "alignSelf: 'stretch'",
  'text-5xl': 'fontSize: 48',
  'h-full': "height: '100%'",
  'text-amber-800': "color: '#92400E'",
  'text-amber-700/80': "color: 'rgba(180,83,9,0.8)'",
  'text-amber-600 italic': "color: '#D97706', fontStyle: 'italic'",
  'flex-col': "flexDirection: 'column'",
  'leading-relaxed': 'lineHeight: 20',
  'space-y-3': 'gap: 12',
  'bg-emerald-500': "backgroundColor: '#10B981'",
};

// Sort by length (longest first) so compound classes match before simple ones
const sortedKeys = Object.keys(todoMap).sort((a, b) => b.length - a.length);

let totalFixes = 0;
let fixedFiles = 0;

const dirs = ['mobile/src/screens', 'mobile/src/components'];

for (const dir of dirs) {
  const files = findTsx(dir);
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    const before = (content.match(/\/\* TODO:/g) || []).length;
    if (before === 0) continue;

    for (const key of sortedKeys) {
      const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const styleProps = todoMap[key];

      // Pattern: style={{ ...props }} /* TODO: key */> or />
      // We need to insert the new props INSIDE the last }} before the TODO comment
      // Match: }} /* TODO: key */ — replace with , newProps }}
      const pat1 = new RegExp(
        '(\\}\\})\\s*\\/\\*\\s*TODO:\\s*' + escapedKey + '\\s*\\*\\/',
        'g'
      );
      content = content.replace(pat1, ', ' + styleProps + ' }}');

      // Pattern: style={styles.xxx} /* TODO: key */
      // This case: merge with array style
      // For now just remove the TODO comment (style is in StyleSheet, TODO is cosmetic)
      const pat2 = new RegExp(
        '(\\})\\s*\\/\\*\\s*TODO:\\s*' + escapedKey + '\\s*\\*\\/',
        'g'
      );
      // Only replace if NOT preceded by another }
      content = content.replace(pat2, (match, p1, offset) => {
        // Check char before the matched }
        const charBefore = content[offset - 1];
        if (charBefore === '}') {
          // Already handled by pat1
          return match;
        }
        // This is a single } — likely closing a style={} or similar
        // Add the props before closing
        return ', ' + styleProps + ' }';
      });
    }

    const after = (content.match(/\/\* TODO:/g) || []).length;
    const fixes = before - after;
    if (fixes > 0) {
      fs.writeFileSync(file, content, 'utf8');
      totalFixes += fixes;
      fixedFiles++;
      console.log(`${path.relative('.', file)}: ${fixes} fixes`);
    }
  }
}

console.log('---');
console.log(`Files fixed: ${fixedFiles}`);
console.log(`TODOs resolved: ${totalFixes}`);

let remaining = 0;
for (const dir of dirs) {
  for (const file of findTsx(dir)) {
    const c = fs.readFileSync(file, 'utf8');
    const matches = c.match(/\/\* TODO:[^*]*\*\//g);
    if (matches) {
      remaining += matches.length;
      if (matches.length > 0) {
        console.log(`  remaining in ${path.relative('.', file)}: ${matches.map(m => m.slice(0, 40)).join(', ')}`);
      }
    }
  }
}
console.log(`Remaining TODOs: ${remaining}`);
