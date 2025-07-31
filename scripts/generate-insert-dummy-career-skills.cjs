const fs = require('fs');
const path = require('path');

// 入力jsonファイル
const inputPath = path.join(
  __dirname,
  '..',
  'public',
  'reference',
  'dummy_user_data',
  'dummy_career_skills.json'
);
const outputPath = path.join(
  __dirname,
  '..',
  'sql',
  'insert_dummy_career_skills.sql'
);

// JSON読み込み
const data = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

// SQLエスケープ関数
function escapeSQL(str) {
  if (str === null || str === undefined) return 'NULL';
  if (str === '') return 'NULL';
  return `'${str.replace(/\\/g, '\\\\').replace(/'/g, "''")}'`;
}

let sql = `\\encoding UTF8;
-- INSERT INTO career_skills
`;

for (const rec of data) {
  sql += `INSERT INTO career_skills (career_id, skill_id, version) VALUES (${escapeSQL(rec.career_id)}, ${escapeSQL(rec.skill_id)}, ${escapeSQL(rec.version)}) ON CONFLICT (career_id, skill_id) DO NOTHING;\n`;
}

// 書き出し
fs.writeFileSync(outputPath, sql, 'utf-8');
console.log('insert_dummy_career_skills.sql generated!');
