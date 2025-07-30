const fs = require('fs');
const path = require('path');

// skills_*.jsonを全部読み込む
const skillDir = path.join(__dirname, '..', 'public', 'reference', 'skills');
const outputDir = path.join(__dirname, '..', 'sql');
const skillFiles = fs
  .readdirSync(skillDir)
  .filter((f) => f.startsWith('skills_') && f.endsWith('.json'));

let skillCategories = new Set();
let skillTags = new Set();
let skills = [];
let skillTagMap = [];

// 既知のカテゴリ・タグ情報（必要ならskills_categories.jsonやskill_tags.jsonからも生成）
const CATEGORY_LABELS = {
  os: 'OS',
  language: 'プログラミング言語',
  framework: 'フレームワーク・ライブラリ',
  database: 'データベース管理',
  tool: 'ツール',
  network: `ネットワーク`,
  security: 'セキュリティ',
  ai: 'AI',
  design: 'デザイン',
  testing: 'テスト',
  cloud: 'クラウド',
  package: 'パッケージ管理',
  cicd: 'CI/CD',
  datascience: 'データサイエンス',
};

function escapeSQL(str) {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\\\') // バックスラッシュ
    .replace(/'/g, "''") // シングルクォート
    .replace(/\n/g, '\\n') // 改行
    .replace(/\r/g, '\\r');
}

for (const file of skillFiles) {
  const arr = JSON.parse(fs.readFileSync(path.join(skillDir, file), 'utf-8'));
  for (const skill of arr) {
    skills.push(skill);

    // カテゴリを抽出
    if (skill.categoryId && CATEGORY_LABELS[skill.categoryId]) {
      skillCategories.add(skill.categoryId);
    }

    // タグを抽出
    if (skill.tags) {
      for (const tag of skill.tags) {
        skillTags.add(tag);
      }
      // skill_tag_map
      for (const tag of skill.tags) {
        skillTagMap.push({ skill_id: skill.id, tag_id: tag });
      }
    }
  }
}

// SQLファイル生成
let sql = `\\encoding UTF8;\n`;
sql += '-- skill_categories\n';
for (const categoryId of skillCategories) {
  sql += `INSERT INTO skill_categories (id, label) VALUES ('${categoryId}', '${escapeSQL(CATEGORY_LABELS[categoryId])}') ON CONFLICT (id) DO NOTHING;\n`;
}
sql += '\n-- skill_tags\n';
for (const tagId of skillTags) {
  sql += `INSERT INTO skill_tags (id, label) VALUES ('${tagId}', '${escapeSQL(tagId)}') ON CONFLICT (id) DO NOTHING;\n`;
}
sql += '\n-- skills\n';
for (const skill of skills) {
  sql += `INSERT INTO skills (id, label, description, devicon_id, category_id) VALUES ('${escapeSQL(skill.id)}', '${escapeSQL(skill.label)}', '${escapeSQL(skill.description || '')}', '${escapeSQL(skill.deviconId || '')}', '${escapeSQL(skill.categoryId)}') ON CONFLICT (id) DO NOTHING;\n`;
}
sql += '\n-- skill_tag_map\n';
for (const { skill_id, tag_id } of skillTagMap) {
  sql += `INSERT INTO skill_tag_map (skill_id, tag_id) VALUES ('${escapeSQL(skill_id)}', '${escapeSQL(tag_id)}') ON CONFLICT DO NOTHING;\n`;
}

// 書き出し
fs.writeFileSync(path.join(outputDir, 'insert_skills.sql'), sql);
console.log('insert_skills.sql generated!');
