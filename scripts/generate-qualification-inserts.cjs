const fs = require('fs');
const path = require('path');

// 入力jsonファイルのパス
const inputPath = path.join(
  __dirname,
  '..',
  'public',
  'reference',
  'qualifications',
  'qualifications.json',
);
// 出力先
const outputPath = path.join(__dirname, '..', 'sql', 'insert_qualifications.sql');

// JSON読み込み
const qualifications = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

function escapeSQL(str) {
  if (str === undefined || str === null) return '';
  return str.replace(/\\/g, '\\\\').replace(/'/g, "''").replace(/\n/g, '\\n').replace(/\r/g, '\\r');
}

let sql = `\\encoding UTF8;
-- qualifications INSERT
`;

for (const q of qualifications) {
  sql += `INSERT INTO qualifications (id, name, description, is_national) VALUES (
    '${escapeSQL(q.id)}',
    '${escapeSQL(q.name)}',
    '${escapeSQL(q.description || '')}',
    ${q.is_national ? 'true' : 'false'}
  ) ON CONFLICT (id) DO NOTHING;\n`;
}

// ファイル書き出し
fs.writeFileSync(outputPath, sql, 'utf-8');
console.log('insert_qualifications.sql generated!');
