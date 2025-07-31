const fs = require('fs');
const path = require('path');

// 入力ファイル（JSON）と出力ファイル（SQL）
const inputFile = path.join(
  __dirname,
  '..',
  'public',
  'reference',
  'dummy_user_data',
  'dummy_career_histories.json'
);
const outputFile = path.join(
  __dirname,
  '..',
  'sql',
  'insert_dummy_career_histories.sql'
);

// SQLの特殊文字をエスケープ
function escapeSQL(str) {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "''")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
}

// JSON読み込み
const careers = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));

// SQL生成
let sql = '\\encoding UTF8;\n-- career_histories\n';

if (careers.length === 0) {
  sql += '-- No data\n';
} else {
  sql +=
    'INSERT INTO career_histories (id, user_id, title, started_at, ended_at, description, role, scale)\nVALUES\n';

  // データ行
  sql += careers
    .map((career, i) => {
      return `  ('${escapeSQL(career.id)}', '${escapeSQL(career.user_id)}', '${escapeSQL(career.title)}', '${career.started_at}', '${career.ended_at}', '${escapeSQL(career.description)}', '${escapeSQL(career.role)}', '${escapeSQL(career.scale)}')${i === careers.length - 1 ? '' : ','}`;
    })
    .join('\n');

  // 重複防止: 一意の組み合わせに対してON CONFLICT句
  // career_historiesにUNIQUE制約(user_id, title, started_at, ended_at)がある場合のみ使う
  sql += '\nON CONFLICT DO NOTHING;\n';
}

// 書き出し
fs.writeFileSync(outputFile, sql, 'utf-8');
console.log('insert_dummy_career_histories.sql generated!');
