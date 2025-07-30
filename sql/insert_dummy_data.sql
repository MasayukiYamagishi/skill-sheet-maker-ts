\encoding UTF8;
-- === 山田 太郎（Taro Yamada） ===
WITH inserted_user AS (
  INSERT INTO users (
    user_identifier, name, name_reading, birth_date, age, gender, email,
    mbti_result, mbti_explanation, enrollment_start_date, enrollment_end_date
  ) VALUES (
    'a1b2c3d4-e5f6-7a8b-9c0d-1234567890ab',
    '山田太郎',
    'ヤマダタロウ',
    '1996-07-15',
    28,
    '男性',
    'taro.yamada@example.com',
    'INTP',
    'Turbulent',
    '2024-04-01',
    NULL
  )
  RETURNING id
)
INSERT INTO qualifications (user_id, qualification) VALUES
  ((SELECT id FROM inserted_user), 'ITパスポート');

WITH inserted_user AS (
  SELECT id FROM users WHERE user_identifier = 'a1b2c3d4-e5f6-7a8b-9c0d-1234567890ab'
)
INSERT INTO career_histories (user_id, career_description) VALUES
  ((SELECT id FROM inserted_user), '2019-04-01 ABC株式会社 - 開発エンジニア');

WITH inserted_user AS (
  SELECT id FROM users WHERE user_identifier = 'a1b2c3d4-e5f6-7a8b-9c0d-1234567890ab'
)
INSERT INTO skills (user_id, skill_name, skill_level) VALUES
  ((SELECT id FROM inserted_user), 'TypeScript', 4),
  ((SELECT id FROM inserted_user), 'React', 3),
  ((SELECT id FROM inserted_user), 'GraphQL', 2);

-- === 鈴木 花子（Hanako Suzuki） ===
WITH inserted_user AS (
  INSERT INTO users (
    user_identifier, name, name_reading, birth_date, age, gender, email,
    mbti_result, mbti_explanation, enrollment_start_date, enrollment_end_date
  ) VALUES (
    'f6e5d4c3-b2a1-0f9e-8d7c-6543210987fe',
    '鈴木花子',
    'スズキハナコ',
    '1991-02-20',
    32,
    '女性',
    'hanako.suzuki@example.com',
    'INFJ',
    'Assertive',
    '2023-10-01',
    '2024-03-31'
  )
  RETURNING id
)
INSERT INTO qualifications (user_id, qualification) VALUES
  ((SELECT id FROM inserted_user), '基本情報技術者'),
  ((SELECT id FROM inserted_user), '応用情報技術者');

WITH inserted_user AS (
  SELECT id FROM users WHERE user_identifier = 'f6e5d4c3-b2a1-0f9e-8d7c-6543210987fe'
)
INSERT INTO career_histories (user_id, career_description) VALUES
  ((SELECT id FROM inserted_user), '2018-06-01 XYZ株式会社 入社'),
  ((SELECT id FROM inserted_user), '2022-10-01 XYZ株式会社 一身上の都合により退職');

WITH inserted_user AS (
  SELECT id FROM users WHERE user_identifier = 'f6e5d4c3-b2a1-0f9e-8d7c-6543210987fe'
)
INSERT INTO skills (user_id, skill_name, skill_level) VALUES
  ((SELECT id FROM inserted_user), 'Python', 5),
  ((SELECT id FROM inserted_user), 'Django', 4),
  ((SELECT id FROM inserted_user), 'SQL', 4);
