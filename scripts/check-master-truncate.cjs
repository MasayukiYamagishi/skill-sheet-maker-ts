const { execSync } = require('child_process');

// 対象DB
const dbs = ['users_test', 'users_prod'];
const user = 'devuser';

// チェック対象テーブル
const tables = [
  'skill_categories',
  'skill_tags',
  'skill_tag_map',
  'skills',
  'qualifications',
  'mbti_groups',
  'mbti_types',
  'mbti_identities',
];

// SQLでテーブル存在確認
function tableExistsSQL(tbl) {
  return `SELECT to_regclass('${tbl}') IS NOT NULL AS exists;`;
}

for (const db of dbs) {
  for (const table of tables) {
    try {
      const result = execSync(
        `psql -U ${user} -d ${db} -t -c "${tableExistsSQL(table)}"`
      )
        .toString()
        .trim();
      if (result !== 't') {
        throw new Error(`テーブル${table}がDB ${db} に存在しません。`);
      }
    } catch (e) {
      console.error(e.message);
      process.exit(1);
    }
  }
  // TRUNCATE
  try {
    execSync(`psql -U ${user} -d ${db} -f ./sql/truncate_masters.sql`, {
      stdio: 'inherit',
    });
  } catch (e) {
    console.error(`[${db}]のTRUNCATEに失敗しました:`, e.message);
    process.exit(1);
  }
}
console.log('すべてのマスター関連テーブルのTRUNCATEが完了しました。');
