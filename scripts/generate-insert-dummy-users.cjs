const fs = require('fs');
const path = require('path');

// ファイルパス設定
const dir = path.join(__dirname, '..', 'public', 'reference', 'dummy_user_data');
const input = path.join(dir, 'dummy_users.json');
const output = path.join(__dirname, '..', 'sql', 'insert_dummy_users.sql');

// JSON読み込み
const users = JSON.parse(fs.readFileSync(input, 'utf8'));

// 値をSQL用にエスケープ
function esc(val) {
  if (val === null || val === undefined) return 'NULL';
  // 日付型も基本的にクオート
  return `'${String(val).replace(/'/g, "''")}'`;
}

// INSERT文を作る
let sql = `-- ダミーユーザーのINSERT\n\\encoding UTF8;\n`;
sql += `-- users（ユーザ情報）\n`;

for (const u of users) {
  sql +=
    `INSERT INTO users (` +
    `id, user_identifier, name, name_kana, birth_date, gender, email, mbti_type, mbti_identity, joined_at, retired_at, final_education, status, affiliation, avatar_path, github_url, pr_text, specialty, tech_strength, sales_comment, toeic_score, other_skills` +
    `) VALUES (` +
    [
      esc(u.id),
      esc(u.user_identifier),
      esc(u.name),
      esc(u.name_kana),
      esc(u.birth_date),
      esc(u.gender),
      esc(u.email),
      esc(u.mbti_type),
      esc(u.mbti_identity),
      esc(u.joined_at),
      esc(u.retired_at),
      esc(u.final_education),
      esc(u.status),
      esc(u.affiliation),
      esc(u.avatar_path),
      esc(u.github_url),
      esc(u.pr_text),
      esc(u.specialty),
      esc(u.tech_strength),
      esc(u.sales_comment),
      u.toeic_score === null || u.toeic_score === undefined ? 'NULL' : Number(u.toeic_score),
      esc(u.other_skills),
    ].join(', ') +
    `) ON CONFLICT (id) DO NOTHING;\n`;
}

// SQLファイル書き出し
fs.writeFileSync(output, sql, { encoding: 'utf8' });
console.log('insert_dummy_users.sql generated!');
