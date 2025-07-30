\encoding UTF8;
-- mbti_groups
INSERT INTO mbti_groups (id, label, description) VALUES ('analyst', '分析家', '独創的で戦略的な思想家。論理的で合理的な分析力が特徴。') ON CONFLICT (id) DO NOTHING;
INSERT INTO mbti_groups (id, label, description) VALUES ('diplomat', '外交官', '他者への共感力と人間関係の構築が得意なタイプ。') ON CONFLICT (id) DO NOTHING;
INSERT INTO mbti_groups (id, label, description) VALUES ('sentinel', '番人', '伝統や秩序を重んじ、責任感と安定感を持つ実直なタイプ。') ON CONFLICT (id) DO NOTHING;
INSERT INTO mbti_groups (id, label, description) VALUES ('explorer', '探検家', '柔軟で冒険心があり、現実的かつ機転が利くタイプ。') ON CONFLICT (id) DO NOTHING;

-- mbti_identities
INSERT INTO mbti_identities (code, label, description) VALUES ('A', '自己主張型', '安定した自己イメージを持ち、ストレスや外部環境に左右されにくい。') ON CONFLICT (code) DO NOTHING;
INSERT INTO mbti_identities (code, label, description) VALUES ('T', '神経型', '繊細で自己評価に敏感、ストレスや変化に影響されやすい。') ON CONFLICT (code) DO NOTHING;

-- mbti_types
INSERT INTO mbti_types (code, group_id, name, name_en, positive_keywords, negative_keywords, description, features) VALUES (
  'INTJ',
  'analyst',
  '建築家',
  'Architect',
  ARRAY['戦略的','独立心','分析的'],
  ARRAY['頑固','感情表現が苦手','協調性に乏しい'],
  'INTJ型は、長期的な視野で物事を計画し、独自の理論を構築することを好みます。論理的かつ戦略的に判断し、目標達成のために粘り強く取り組みます。自身の信念や考え方を大切にしますが、その一方で他者と意見が衝突することもあります。',
  ARRAY['長期的な計画を立てるのが得意です','独自の視点で問題を分析します','理論やシステムの構築を楽しみます']
) ON CONFLICT (code) DO NOTHING;
INSERT INTO mbti_types (code, group_id, name, name_en, positive_keywords, negative_keywords, description, features) VALUES (
  'INTP',
  'analyst',
  '論理学者',
  'Logician',
  ARRAY['論理的','好奇心旺盛','柔軟な発想'],
  ARRAY['優柔不断','感情に無頓着','現実逃避しがち'],
  'INTP型は、物事の本質を探求し、独創的なアイデアを考えることに喜びを感じます。知的好奇心が強く、理論やシステムの理解に熱心です。他者との議論も好みますが、日常的なルールや慣習にはあまり関心を持たない傾向があります。',
  ARRAY['新しい理論やアイデアを考えるのが好きです','論理的に問題を解決します','独自の視点で物事を捉えます']
) ON CONFLICT (code) DO NOTHING;
INSERT INTO mbti_types (code, group_id, name, name_en, positive_keywords, negative_keywords, description, features) VALUES (
  'ENTJ',
  'analyst',
  '指揮官',
  'Commander',
  ARRAY['リーダーシップ','決断力','効率的'],
  ARRAY['支配的','感情を軽視','柔軟性に欠ける'],
  'ENTJ型は、目的達成に向けて計画を立て、率先して行動するリーダータイプです。論理的かつ効率的な方法を重視し、組織やプロジェクトをまとめる力に優れています。自信に満ちていますが、時に強引と受け取られることもあります。',
  ARRAY['目標達成のために積極的に行動します','組織やチームをまとめることが得意です','効率性や成果を重視します']
) ON CONFLICT (code) DO NOTHING;
INSERT INTO mbti_types (code, group_id, name, name_en, positive_keywords, negative_keywords, description, features) VALUES (
  'ENTP',
  'analyst',
  '討論者',
  'Debater',
  ARRAY['柔軟な思考','創造力','知的好奇心'],
  ARRAY['議論好き','飽きっぽい','計画性が低い'],
  'ENTP型は、新しいアイデアや知識を追求し、知的な議論や挑戦を楽しむタイプです。発想力が豊かで、柔軟に物事を考えます。変化や新しい環境にも適応しやすいですが、関心が移りやすく継続力に課題を感じることもあります。',
  ARRAY['新しいアイデアや議論を楽しみます','変化やチャレンジに積極的です','発想力やユーモアがあります']
) ON CONFLICT (code) DO NOTHING;
INSERT INTO mbti_types (code, group_id, name, name_en, positive_keywords, negative_keywords, description, features) VALUES (
  'INFJ',
  'diplomat',
  '提唱者',
  'Advocate',
  ARRAY['思いやり','直感的','誠実'],
  ARRAY['理想主義','内向的','自己犠牲的'],
  'INFJ型は、他者への思いやりや共感力が高く、自分の信念を大切にします。理想を掲げて静かに周囲に良い影響を与えようと努力します。深い洞察力と直感を持ち、困っている人を支えることに喜びを感じます。',
  ARRAY['他者の気持ちに寄り添うことが得意です','理想や信念を持って行動します','静かに周囲を導くリーダーシップがあります']
) ON CONFLICT (code) DO NOTHING;
INSERT INTO mbti_types (code, group_id, name, name_en, positive_keywords, negative_keywords, description, features) VALUES (
  'INFP',
  'diplomat',
  '仲介者',
  'Mediator',
  ARRAY['創造力','誠実','柔軟性'],
  ARRAY['感情的','現実逃避','優柔不断'],
  'INFP型は、創造的で誠実な心を持ち、自分や他者の本質を大切にします。価値観に従って柔軟に物事を考え、人の気持ちに敏感です。自分の理想や夢に向かって粘り強く取り組みますが、感情に流されやすい一面もあります。',
  ARRAY['自分や他人の価値観を尊重します','想像力豊かで独自の世界観を持ちます','人を励ましたり支えたりするのが得意です']
) ON CONFLICT (code) DO NOTHING;
INSERT INTO mbti_types (code, group_id, name, name_en, positive_keywords, negative_keywords, description, features) VALUES (
  'ENFJ',
  'diplomat',
  '主人公',
  'Protagonist',
  ARRAY['社交的','情熱的','指導力'],
  ARRAY['過干渉','理想主義','感情的'],
  'ENFJ型は、他者の成長や幸福のために情熱的に行動するリーダータイプです。強い共感力と指導力を持ち、周囲の人々を勇気づけて導きます。理想を追求しすぎて負担を感じたり、過度に干渉してしまうこともあります。',
  ARRAY['人を励ましたり導いたりするのが得意です','集団の雰囲気を明るくします','周囲の成長を支援します']
) ON CONFLICT (code) DO NOTHING;
INSERT INTO mbti_types (code, group_id, name, name_en, positive_keywords, negative_keywords, description, features) VALUES (
  'ENFP',
  'diplomat',
  '運動家',
  'Campaigner',
  ARRAY['創造力','好奇心旺盛','共感力'],
  ARRAY['気分屋','優柔不断','計画性が低い'],
  'ENFP型は、創造力と好奇心にあふれ、自由な発想で人と関わることを楽しみます。多様な価値観を受け入れ、他者に対しても共感的に接します。新しいことに興味を持ちやすい反面、集中力や計画性に課題を感じることもあります。',
  ARRAY['新しいアイデアや体験を楽しみます','多様な人々と関わることが好きです','周囲に明るさや刺激を与えます']
) ON CONFLICT (code) DO NOTHING;
INSERT INTO mbti_types (code, group_id, name, name_en, positive_keywords, negative_keywords, description, features) VALUES (
  'ISTJ',
  'sentinel',
  '管理者',
  'Logistician',
  ARRAY['責任感','勤勉','実直'],
  ARRAY['頑固','柔軟性に欠ける','感情表現が苦手'],
  'ISTJ型は、誠実さと責任感を大切にし、決められたルールや手順を忠実に守ります。組織や社会の中で安定した役割を果たすことが得意です。自分の価値観を守るため、時に柔軟さを欠くこともありますが、着実に物事を進めていきます。',
  ARRAY['約束やルールを守ることを重視します','計画的に物事を進めます','現実的な視点で課題に取り組みます']
) ON CONFLICT (code) DO NOTHING;
INSERT INTO mbti_types (code, group_id, name, name_en, positive_keywords, negative_keywords, description, features) VALUES (
  'ISFJ',
  'sentinel',
  '擁護者',
  'Defender',
  ARRAY['思いやり','献身的','信頼性'],
  ARRAY['自己主張が苦手','変化が苦手','心配性'],
  'ISFJ型は、他者を思いやる気持ちと忠実さが特徴です。家庭や職場で周囲を支え、責任感を持って役割を果たします。目立つことを好みませんが、誰かの役に立つことに強い喜びを感じます。変化には慎重な傾向があります。',
  ARRAY['周囲への気配りを忘れません','責任感を持ってサポートします','細やかな配慮ができます']
) ON CONFLICT (code) DO NOTHING;
INSERT INTO mbti_types (code, group_id, name, name_en, positive_keywords, negative_keywords, description, features) VALUES (
  'ESTJ',
  'sentinel',
  '幹部',
  'Executive',
  ARRAY['統率力','実行力','公正'],
  ARRAY['頑固','支配的','感情を軽視'],
  'ESTJ型は、組織や集団の中でリーダーシップを発揮し、効率的かつ公正に物事を進めます。自分にも他人にも厳しく、責任を持って目標達成を目指します。現実的な視点を持ちますが、時に強引に見られることもあります。',
  ARRAY['物事を着実に推進します','組織や集団をまとめる力があります','公正さやルールを重視します']
) ON CONFLICT (code) DO NOTHING;
INSERT INTO mbti_types (code, group_id, name, name_en, positive_keywords, negative_keywords, description, features) VALUES (
  'ESFJ',
  'sentinel',
  '領事',
  'Consul',
  ARRAY['協調性','親しみやすさ','面倒見が良い'],
  ARRAY['他人の評価を気にする','感情的','自己主張が控えめ'],
  'ESFJ型は、周囲との調和や協力を大切にし、他人を助けることにやりがいを感じます。親しみやすく面倒見も良いため、多くの人に信頼される存在です。人間関係を重視するあまり、他人の評価に敏感になることがあります。',
  ARRAY['周囲と協力して物事を進めます','親しみやすく相談に乗るのが得意です','人の役に立つことを大切にします']
) ON CONFLICT (code) DO NOTHING;
INSERT INTO mbti_types (code, group_id, name, name_en, positive_keywords, negative_keywords, description, features) VALUES (
  'ISTP',
  'explorer',
  '巨匠',
  'Virtuoso',
  ARRAY['柔軟','観察力','実践的'],
  ARRAY['感情表現が苦手','衝動的','協調性に欠ける'],
  'ISTP型は、観察力に優れ、現実的かつ柔軟に物事を捉えます。新しいことへの好奇心が強く、自分の手で試行錯誤するのを好みます。状況に応じて臨機応変に行動しますが、感情の表現は控えめです。',
  ARRAY['物事を論理的かつ実践的に考えます','新しい技術や道具の扱いが得意です','自分で経験して学ぶことを重視します']
) ON CONFLICT (code) DO NOTHING;
INSERT INTO mbti_types (code, group_id, name, name_en, positive_keywords, negative_keywords, description, features) VALUES (
  'ISFP',
  'explorer',
  '冒険家',
  'Adventurer',
  ARRAY['芸術的','優しさ','柔軟性'],
  ARRAY['内向的','流されやすい','気分屋'],
  'ISFP型は、感性が豊かで、芸術や自然の美しさを楽しむことができます。静かで控えめながらも他者に優しく、柔軟に物事を受け入れます。自分の価値観を大切にし、自由な生き方を望みますが、気分の変化には敏感です。',
  ARRAY['美的感覚や創造力に優れています','穏やかで親しみやすい性格です','自由で柔軟な考え方を持っています']
) ON CONFLICT (code) DO NOTHING;
INSERT INTO mbti_types (code, group_id, name, name_en, positive_keywords, negative_keywords, description, features) VALUES (
  'ESTP',
  'explorer',
  '起業家',
  'Entrepreneur',
  ARRAY['行動力','社交的','現実的'],
  ARRAY['衝動的','慎重さに欠ける','短気'],
  'ESTP型は、行動力と社交性にあふれ、現実的な問題解決が得意です。新しい刺激や挑戦を好み、困難な状況でも臨機応変に対応できます。勢いのある性格ですが、慎重さに欠ける一面もあります。',
  ARRAY['即断即決で行動します','人とのコミュニケーションが得意です','現実的に問題を解決します']
) ON CONFLICT (code) DO NOTHING;
INSERT INTO mbti_types (code, group_id, name, name_en, positive_keywords, negative_keywords, description, features) VALUES (
  'ESFP',
  'explorer',
  'エンターテイナー',
  'Entertainer',
  ARRAY['明るい','社交的','順応性'],
  ARRAY['気分屋','注目されたい','計画性が低い'],
  'ESFP型は、明るく社交的で、周囲の人々を楽しませることが得意です。新しい出会いや経験に前向きで、柔軟に環境に順応します。注目を集めたい気持ちが強く、計画的な行動は苦手なことがあります。',
  ARRAY['場の雰囲気を明るくします','新しい体験や人との交流を楽しみます','柔軟に環境へ適応します']
) ON CONFLICT (code) DO NOTHING;

