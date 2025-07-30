const fs = require('fs');
const path = require('path');

// 入力jsonファイルのパス
const inputPath = path.join(
  __dirname,
  '..',
  'public',
  'reference',
  'dummy_user_data',
  'dummy_user_skills.json',
);
const outputPath = path.join(__dirname, '..', 'sql', 'insert_dummy_user_skills.sql');

// json読込
const skillData = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

function escapeSQL(str) {
  if (!str) return '';
  return str.replace(/\\/g, '\\\\').replace(/'/g, "''").replace(/\n/g, '\\n').replace(/\r/g, '\\r');
}

// 1行目にエンコーディング宣言
let sql = `\\encoding UTF8;
-- INSERT INTO user_skills
`;

// INSERT文を生成
for (const skill of skillData) {
  // versionが空の場合はNULL
  const versionValue =
    skill.version && skill.version.trim() !== '' ? `'${escapeSQL(skill.version)}'` : 'NULL';

  sql += `INSERT INTO user_skills (user_id, skill_id, version) VALUES ('${skill.user_id}', '${skill.skill_id}', ${versionValue}) ON CONFLICT (user_id, skill_id) DO NOTHING;\n`;
}

// 書き込み
fs.writeFileSync(outputPath, sql, 'utf-8');
console.log('insert_dummy_user_skills.sql generated!');
