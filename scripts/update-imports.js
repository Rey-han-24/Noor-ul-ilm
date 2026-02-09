/**
 * Script to update import paths after folder restructure
 */

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

const replacements = [
  // Components
  [/@\/components\//g, '@/frontend/components/'],
  // Hooks
  [/@\/hooks\//g, '@/frontend/hooks/'],
  // Types
  [/@\/types\//g, '@/shared/types/'],
  // Backend lib
  [/@\/lib\/prisma/g, '@/backend/lib/prisma'],
  [/@\/lib\/db/g, '@/backend/lib/db'],
  [/@\/lib\/auth-server/g, '@/backend/lib/auth-server'],
  [/@\/lib\/api-security/g, '@/backend/lib/api-security'],
  // Backend services
  [/@\/lib\/hadith-api/g, '@/backend/services/hadith-api'],
  [/@\/lib\/hadith-external-api/g, '@/backend/services/hadith-external-api'],
  [/@\/lib\/quran-api/g, '@/backend/services/quran-api'],
  [/@\/lib\/search-api/g, '@/backend/services/search-api'],
  [/@\/lib\/daily-content/g, '@/backend/services/daily-content'],
  // Shared utils
  [/@\/lib\/utils/g, '@/shared/utils/utils'],
  [/@\/lib\/auth-shared/g, '@/shared/utils/auth-shared'],
  [/@\/lib\/auth(?!-)/g, '@/shared/utils/auth'],
  [/@\/lib\/constants/g, '@/shared/constants/constants'],
];

function getAllFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      getAllFiles(fullPath, files);
    } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  for (const [pattern, replacement] of replacements) {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated:', filePath);
  }
}

console.log('Updating import paths...\n');

const files = getAllFiles(srcDir);
let count = 0;

for (const file of files) {
  const originalContent = fs.readFileSync(file, 'utf8');
  updateFile(file);
  const newContent = fs.readFileSync(file, 'utf8');
  if (originalContent !== newContent) {
    count++;
  }
}

console.log(`\nDone! Updated ${count} files.`);
