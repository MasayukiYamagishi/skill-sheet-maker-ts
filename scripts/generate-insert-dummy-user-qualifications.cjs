const fs = require('fs');
const path = require('path');

// 入力JSONのパス
const inputPath = path.join(
  __dirname,
  '..',
  'public',
  'reference',
  'dummy_user_data',
  'dummy_user_qualifications.json',
);
const outputPath = path.join(__dirname, '..', 'sql', 'insert_dummy_user_qualifications.sql');

const qualifications = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

let sql = `\\encoding UTF8;
-- INSERT INTO user_qualifications
`;

for (const row of qualifications) {
  const userId = row.user_id;
  const qualificationId = row.qualification_id;
  const acquiredAt = row.acquired_at ? `'${row.acquired_at}'` : 'NULL';

  sql += `INSERT INTO user_qualifications (user_id, qualification_id, acquired_at) VALUES ('${userId}', '${qualificationId}', ${acquiredAt}) ON CONFLICT (user_id, qualification_id) DO NOTHING;\n`;
}

fs.writeFileSync(outputPath, sql, 'utf-8');
console.log('insert_dummy_user_qualifications.sql generated!');
