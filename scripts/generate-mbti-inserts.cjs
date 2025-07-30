const fs = require('fs');
const path = require('path');

// ファイルパス
const groupPath = path.resolve(__dirname, '../public/reference/mbti/mbti_group.json');
const identitiesPath = path.resolve(__dirname, '../public/reference/mbti/mbti_identities.json');
const typesPath = path.resolve(__dirname, '../public/reference/mbti/mbti_types.json');
const outputPath = path.resolve(__dirname, '../sql/insert_mbti.sql');

// 配列をPostgreSQLのTEXT[]形式に変換
function toPgArray(arr) {
  if (!Array.isArray(arr)) return 'NULL';
  // シングルクォートをエスケープ
  const escaped = arr.map((s) => "'" + s.replace(/'/g, "''") + "'").join(',');
  return `ARRAY[${escaped}]`;
}

// 値をSQL用にエスケープ＆NULL対応
function sqlValue(val) {
  if (val === null || val === undefined) return 'NULL';
  // 配列は別処理
  if (Array.isArray(val)) return toPgArray(val);
  // 文字列
  return "'" + String(val).replace(/'/g, "''") + "'";
}

function generateSql() {
  let sql = `\\encoding UTF8;\n`;

  // mbti_groups
  const groups = JSON.parse(fs.readFileSync(groupPath, 'utf8'));
  sql += '-- mbti_groups\n';
  for (const g of groups) {
    sql += `INSERT INTO mbti_groups (id, label, description) VALUES (${sqlValue(g.id)}, ${sqlValue(g.label)}, ${sqlValue(g.description)}) ON CONFLICT (id) DO NOTHING;\n`;
  }
  sql += '\n';

  // mbti_identities
  const identities = JSON.parse(fs.readFileSync(identitiesPath, 'utf8'));
  sql += '-- mbti_identities\n';
  for (const i of identities) {
    sql += `INSERT INTO mbti_identities (code, label, description) VALUES (${sqlValue(i.code)}, ${sqlValue(i.label)}, ${sqlValue(i.description)}) ON CONFLICT (code) DO NOTHING;\n`;
  }
  sql += '\n';

  // mbti_types
  const types = JSON.parse(fs.readFileSync(typesPath, 'utf8'));
  sql += '-- mbti_types\n';
  for (const t of types) {
    sql += `INSERT INTO mbti_types (code, group_id, name, name_en, positive_keywords, negative_keywords, description, features) VALUES (\n`;
    sql += `  ${sqlValue(t.code)},\n`;
    sql += `  ${sqlValue(t.group_id)},\n`;
    sql += `  ${sqlValue(t.name)},\n`;
    sql += `  ${sqlValue(t.name_en)},\n`;
    sql += `  ${sqlValue(t.positive_keywords)},\n`;
    sql += `  ${sqlValue(t.negative_keywords)},\n`;
    sql += `  ${sqlValue(t.description)},\n`;
    sql += `  ${sqlValue(t.features)}\n`;
    sql += `) ON CONFLICT (code) DO NOTHING;\n`;
  }
  sql += '\n';

  // SQLファイル書き出し
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, sql, 'utf8');
  console.log(`SQLファイルを出力しました: ${outputPath}`);
}

// 実行
generateSql();
