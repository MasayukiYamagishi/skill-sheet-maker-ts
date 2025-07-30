-- UUIDサポート
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================
-- users（ユーザ情報）
-- （既にUUID型。変更不要）
-- ========================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_identifier TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  name_kana TEXT NOT NULL,
  birth_date DATE NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  email TEXT NOT NULL UNIQUE,
  mbti_type TEXT REFERENCES mbti_types(code),
  mbti_identity TEXT REFERENCES mbti_identities(code),
  joined_at DATE,
  retired_at DATE,
  final_education TEXT,
  status TEXT NOT NULL CHECK (status IN ('inProject', 'available', 'onLeave', 'retired')),
  affiliation TEXT,
  avatar_path TEXT,
  github_url TEXT,
  pr_text TEXT,
  specialty TEXT,
  tech_strength TEXT,
  sales_comment TEXT,
  toeic_score INTEGER CHECK (toeic_score IS NULL OR (toeic_score % 5 = 0 AND toeic_score >= 0)),
  other_skills TEXT
);

-- ========================
-- qualifications（資格マスタ）
-- TEXT型の主キー
-- ========================
CREATE TABLE qualifications (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_national BOOL NOT NULL DEFAULT FALSE
);

-- ========================
-- user_qualifications（ユーザごとの資格）
-- 複合PK（user_id, qualification_id）
-- ========================
CREATE TABLE user_qualifications (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  qualification_id TEXT NOT NULL REFERENCES qualifications(id),
  acquired_at DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, qualification_id)
);

-- ========================
-- skill_categories（スキルカテゴリマスタ）
-- TEXT主キー（現状維持）
-- ========================
CREATE TABLE skill_categories (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  description TEXT
);

-- ========================
-- skill_tags（スキルタグマスタ）
-- TEXT主キー（現状維持）
-- ========================
CREATE TABLE skill_tags (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  description TEXT
);

-- ========================
-- skills（スキルマスタ）
-- TEXT主キー（現状維持）
-- ========================
CREATE TABLE skills (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  description TEXT,
  devicon_id TEXT,
  category_id TEXT NOT NULL REFERENCES skill_categories(id)
);

-- ========================
-- skill_tag_map（スキルタグ付け多対多）
-- 複合PK
-- ========================
CREATE TABLE skill_tag_map (
  skill_id TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  tag_id TEXT NOT NULL REFERENCES skill_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (skill_id, tag_id)
);

-- ========================
-- user_skills（ユーザごとのスキル）
-- 複合PK（user_id, skill_id）
-- ========================
CREATE TABLE user_skills (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL REFERENCES skills(id),
  version TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, skill_id)
);

-- ========================
-- career_histories（経歴）
-- UUID主キー
-- ========================
CREATE TABLE career_histories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  started_at DATE,
  ended_at DATE,
  description TEXT,
  role TEXT,
  scale TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ========================
-- career_skills（経歴ごとのスキル/技術）
-- 複合PK（career_id, skill_id）
-- ========================
CREATE TABLE career_skills (
  career_id UUID NOT NULL REFERENCES career_histories(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL REFERENCES skills(id),
  version TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (career_id, skill_id)
);

-- ========================
-- master_processes（担当工程マスタ）
-- ========================
CREATE TABLE master_processes (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

INSERT INTO master_processes (name) VALUES
  ('要件定義'), ('基本設計'), ('詳細設計'), ('実装'), ('テスト'), ('保守・運用');

-- ========================
-- career_processes（経歴ごとの担当工程）
-- 複合PK（career_id, process_id）
-- ========================
CREATE TABLE career_processes (
  career_id UUID NOT NULL REFERENCES career_histories(id) ON DELETE CASCADE,
  process_id INTEGER NOT NULL REFERENCES master_processes(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (career_id, process_id)
);

-- ========================
-- mbti_groups（MBTIの大分類カテゴリマスタ）
-- ========================
CREATE TABLE mbti_groups (
  id TEXT PRIMARY KEY,        -- 例: "analyst", "diplomat"
  label TEXT NOT NULL,        -- 日本語名: "分析家", "外交官" など
  description TEXT NOT NULL DEFAULT ''            -- 説明文
);


-- ========================
-- mbti_types（MBTI16タイプマスタ）
-- ========================
CREATE TABLE mbti_types (
  code TEXT PRIMARY KEY,            -- 例: "INTJ"
  group_id TEXT NOT NULL REFERENCES mbti_groups(id),
  name TEXT NOT NULL,                              -- 例: "建築家"
  name_en TEXT,                                    -- 英語名（オプション）
  positive_keywords TEXT[] NOT NULL DEFAULT '{}',  -- ポジティブ特徴
  negative_keywords TEXT[] NOT NULL DEFAULT '{}',  -- ネガティブ特徴
  description TEXT NOT NULL,                       -- 長文説明
  features TEXT[] NOT NULL DEFAULT '{}'            -- 特徴リスト
);


-- ========================
-- mbti_identities（MBTI A/T型区分マスタ）
-- ========================
CREATE TABLE mbti_identities (
  code TEXT PRIMARY KEY,                -- "A", "T"
  label TEXT NOT NULL,                  -- "自己主張型", "神経型"
  description TEXT NOT NULL DEFAULT ''  -- 各サブタイプの説明
);
