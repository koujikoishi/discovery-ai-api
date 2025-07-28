import fs from 'fs';
import path from 'path';

// 対象ディレクトリ
const TARGET_DIR = './utils';

// 対象拡張子
const FILE_EXT = '.ts';

// 対象とする import 文の正規表現（キャプチャ1: quote, キャプチャ2: path）
const importRegex = /from\s+(['"])(\.{1,2}\/[^'"]+?)\1/g;

// 除外条件
const isSkippable = (filePath: string) => {
  return (
    filePath.endsWith('.d.ts') ||
    filePath.endsWith('.test.ts') ||
    filePath.includes('node_modules')
  );
};

// import文の `.js` 付加処理
function fixImportPathsInFile(filePath: string) {
  const original = fs.readFileSync(filePath, 'utf-8');
  let updated = false;

  const modified = original.replace(importRegex, (match, quote, importPath) => {
    if (importPath.endsWith('.js') || importPath.startsWith('npm:')) {
      return match;
    }
    updated = true;
    return `from ${quote}${importPath}.js${quote}`;
  });

  if (updated) {
    fs.writeFileSync(filePath, modified, 'utf-8');
    console.log(`✅ updated: ${filePath}`);
  } else {
    console.log(`☑️  skipped: ${filePath}`);
  }
}

// 再帰的にディレクトリ内の .ts ファイルを走査
function walkDirAndFixImports(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDirAndFixImports(fullPath);
    } else if (fullPath.endsWith(FILE_EXT) && !isSkippable(fullPath)) {
      fixImportPathsInFile(fullPath);
    }
  }
}

// 実行
walkDirAndFixImports(TARGET_DIR);
