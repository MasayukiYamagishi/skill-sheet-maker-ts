const fs = require('fs');
const path = require('path');

// ファイルパス
const jsonPath = path.join(
  __dirname,
  '..',
  'public',
  'reference',
  'dummy_user_data',
  'dummy_career_process.json',
);
const outPath = path.join(__dirname, '..', 'sql', 'insert_dummy_career_process.sql');

// JSON読み込み
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

// SQLヘッダ（UTF-8対応）
let sql = `\\encoding UTF8;\n-- INSERT INTO career_processes\n`;

// INSERT文生成
for (const row of data) {
  const career_id = row.career_id;
  const process_id = row.process_id;

  sql += `INSERT INTO career_processes (career_id, process_id) VALUES ('${career_id}', ${process_id}) ON CONFLICT DO NOTHING;\n`;
}

// ファイル出力
fs.writeFileSync(outPath, sql, 'utf-8');
console.log(`insert_dummy_career_process.sql generated!`);
