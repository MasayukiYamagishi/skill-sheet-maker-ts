\encoding UTF8;
-- qualifications INSERT
INSERT INTO qualifications (id, name, description, is_national) VALUES (
    'q_normal_drive_license_at',
    '普通自動車運転免許（AT限定）',
    'オートマチック車限定の普通自動車を運転できる国家資格。',
    true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO qualifications (id, name, description, is_national) VALUES (
    'q_normal_drive_license_mt',
    '普通自動車運転免許（MT）',
    'マニュアル車・オートマ車両の普通自動車を運転できる国家資格。',
    true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO qualifications (id, name, description, is_national) VALUES (
    'q_it_passport',
    'ITパスポート',
    'IT全般・ビジネス基礎知識を幅広く評価する国家資格。',
    true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO qualifications (id, name, description, is_national) VALUES (
    'q_basic_information_technology_engineer',
    '基本情報技術者試験',
    'ITエンジニアの登竜門的な国家試験。IT基礎力を証明。',
    true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO qualifications (id, name, description, is_national) VALUES (
    'q_applied_information_technology_engineer',
    '応用情報技術者試験',
    'IT技術・管理・戦略の知識を評価する国家資格。',
    true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO qualifications (id, name, description, is_national) VALUES (
    'q_information_security_support',
    '情報処理安全確保支援士試験',
    'サイバーセキュリティの専門知識・技能を認定する国家資格。',
    true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO qualifications (id, name, description, is_national) VALUES (
    'q_network_specialist',
    'ネットワークスペシャリスト試験',
    'ネットワーク設計・構築・運用の高度な知識を認定する国家資格。',
    true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO qualifications (id, name, description, is_national) VALUES (
    'q_database_specialist',
    'データベーススペシャリスト試験',
    'DB設計・運用管理・最適化のスキルを認定する国家資格。',
    true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO qualifications (id, name, description, is_national) VALUES (
    'q_system_architect',
    'システムアーキテクト試験',
    '大規模システム設計・構築の技術力を評価する国家資格。',
    true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO qualifications (id, name, description, is_national) VALUES (
    'q_project_manager',
    'プロジェクトマネージャ試験',
    'プロジェクト管理・マネジメント力を評価する国家資格。',
    true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO qualifications (id, name, description, is_national) VALUES (
    'q_aws_solutions_architect_associate',
    'AWS Certified Solutions Architect – Associate',
    'AWS上のシステム設計・運用の基礎スキルを認定する民間資格。',
    false
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO qualifications (id, name, description, is_national) VALUES (
    'q_aws_solutions_architect_professional',
    'AWS Certified Solutions Architect – Professional',
    'AWS上の大規模設計・最適化・管理スキルを認定する民間資格。',
    false
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO qualifications (id, name, description, is_national) VALUES (
    'q_oracle_master_bronze',
    'ORACLE MASTER Bronze',
    'Oracleデータベースの基本運用スキルを認定するベンダー資格。',
    false
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO qualifications (id, name, description, is_national) VALUES (
    'q_oracle_master_silver',
    'ORACLE MASTER Silver',
    'Oracle DB運用・管理・SQLの中級スキルを認定するベンダー資格。',
    false
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO qualifications (id, name, description, is_national) VALUES (
    'q_oracle_master_gold',
    'ORACLE MASTER Gold',
    'Oracle DB高度な運用・設計スキルを認定するベンダー資格。',
    false
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO qualifications (id, name, description, is_national) VALUES (
    'q_java_certification_1st_grade',
    'Javaプログラミング能力認定試験 1級',
    'Javaプログラミングの上級スキルを証明する民間資格。',
    false
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO qualifications (id, name, description, is_national) VALUES (
    'q_java_silver_se',
    'Java Silver SE',
    'Javaの基本文法・開発技術を評価するオラクル認定資格。',
    false
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO qualifications (id, name, description, is_national) VALUES (
    'q_java_gold_se',
    'Java Gold SE',
    'Javaの高度な設計・開発スキルを評価するオラクル認定資格。',
    false
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO qualifications (id, name, description, is_national) VALUES (
    'q_lpic_1',
    'LPIC-1',
    'Linux OSの基本操作・管理スキルを評価する認定資格。',
    false
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO qualifications (id, name, description, is_national) VALUES (
    'q_lpic_2',
    'LPIC-2',
    'Linux OSの中・上級管理スキルを評価する認定資格。',
    false
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO qualifications (id, name, description, is_national) VALUES (
    'q_ccna',
    'CCNA',
    'Ciscoネットワークの構築・運用に必要な技術を証明する資格。',
    false
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO qualifications (id, name, description, is_national) VALUES (
    'q_ccnp',
    'CCNP',
    'Ciscoネットワークの上級設計・運用スキルを認定する資格。',
    false
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO qualifications (id, name, description, is_national) VALUES (
    'q_python3_engineer_basic',
    'Python3エンジニア認定基礎試験',
    'Pythonの基本構文・基礎知識を評価する認定資格。',
    false
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO qualifications (id, name, description, is_national) VALUES (
    'q_python3_engineer_data_analysis',
    'Python3エンジニア認定データ分析試験',
    'Pythonのデータ分析・科学計算スキルを評価する認定資格。',
    false
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO qualifications (id, name, description, is_national) VALUES (
    'q_azure_fundamentals',
    'Microsoft Azure Fundamentals',
    'Azureクラウドの基礎知識・運用スキルを評価する資格。',
    false
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO qualifications (id, name, description, is_national) VALUES (
    'q_g_test',
    'G検定（ジェネラリスト検定）',
    'AI技術全般の知識を問う日本ディープラーニング協会の資格。',
    false
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO qualifications (id, name, description, is_national) VALUES (
    'q_e_test',
    'E資格（エンジニア資格）',
    'AI開発に関する知識・技術を問う日本ディープラーニング協会の資格。',
    false
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO qualifications (id, name, description, is_national) VALUES (
    'q_it_strategist',
    'ITストラテジスト試験',
    '経営戦略やIT戦略の策定・推進に関する高度な知識を評価する国家資格。',
    true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO qualifications (id, name, description, is_national) VALUES (
    'q_system_auditor',
    'システム監査技術者試験',
    'ITシステムの監査・評価の専門スキルを認定する国家資格。',
    true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO qualifications (id, name, description, is_national) VALUES (
    'q_embedded_system_specialist',
    'エンベデッドシステムスペシャリスト試験',
    '組込みシステム開発・運用の高度な専門知識を評価する国家資格。',
    true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO qualifications (id, name, description, is_national) VALUES (
    'q_it_service_manager',
    'ITサービスマネージャ試験',
    'ITサービス運用・管理・品質保証に関する高度な知識を評価する国家資格。',
    true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO qualifications (id, name, description, is_national) VALUES (
    'q_system_operation_management_engineer',
    'システム運用管理エンジニア試験',
    'システムの運用・監視・障害対応など、運用管理に関する知識を評価する国家資格。',
    true
  ) ON CONFLICT (id) DO NOTHING;
