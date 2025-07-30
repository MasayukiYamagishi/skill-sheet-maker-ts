-- skills, qualifications, mbti関連のテーブル名を正確に列挙
TRUNCATE TABLE 
  skill_categories,
  skill_tags,
  skill_tag_map,
  skills, 
  qualifications, 
  mbti_groups, 
  mbti_types, 
  mbti_identities
RESTART IDENTITY CASCADE;
