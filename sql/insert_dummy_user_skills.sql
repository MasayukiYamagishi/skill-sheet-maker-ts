\encoding UTF8;
-- INSERT INTO user_skills
INSERT INTO user_skills (user_id, skill_id, version) VALUES ('08250bb6-60a3-4e65-b0e6-dff9971c15f1', 'skill_python', '3.10') ON CONFLICT (user_id, skill_id) DO NOTHING;
INSERT INTO user_skills (user_id, skill_id, version) VALUES ('08250bb6-60a3-4e65-b0e6-dff9971c15f1', 'skill_pytorch', '1.12') ON CONFLICT (user_id, skill_id) DO NOTHING;
INSERT INTO user_skills (user_id, skill_id, version) VALUES ('08250bb6-60a3-4e65-b0e6-dff9971c15f1', 'skill_fastapi', '0.80') ON CONFLICT (user_id, skill_id) DO NOTHING;
INSERT INTO user_skills (user_id, skill_id, version) VALUES ('08250bb6-60a3-4e65-b0e6-dff9971c15f1', 'skill_postgresql', '15') ON CONFLICT (user_id, skill_id) DO NOTHING;
INSERT INTO user_skills (user_id, skill_id, version) VALUES ('08250bb6-60a3-4e65-b0e6-dff9971c15f1', 'skill_docker', NULL) ON CONFLICT (user_id, skill_id) DO NOTHING;
INSERT INTO user_skills (user_id, skill_id, version) VALUES ('08250bb6-60a3-4e65-b0e6-dff9971c15f1', 'skill_kubernetes', NULL) ON CONFLICT (user_id, skill_id) DO NOTHING;
INSERT INTO user_skills (user_id, skill_id, version) VALUES ('bc6e88c8-0e0d-4c65-b3d6-7ee10cde6750', 'skill_googlecloud', NULL) ON CONFLICT (user_id, skill_id) DO NOTHING;
INSERT INTO user_skills (user_id, skill_id, version) VALUES ('bc6e88c8-0e0d-4c65-b3d6-7ee10cde6750', 'skill_aws', NULL) ON CONFLICT (user_id, skill_id) DO NOTHING;
INSERT INTO user_skills (user_id, skill_id, version) VALUES ('bc6e88c8-0e0d-4c65-b3d6-7ee10cde6750', 'skill_terraform', NULL) ON CONFLICT (user_id, skill_id) DO NOTHING;
INSERT INTO user_skills (user_id, skill_id, version) VALUES ('bc6e88c8-0e0d-4c65-b3d6-7ee10cde6750', 'skill_circleci', NULL) ON CONFLICT (user_id, skill_id) DO NOTHING;
INSERT INTO user_skills (user_id, skill_id, version) VALUES ('bc6e88c8-0e0d-4c65-b3d6-7ee10cde6750', 'skill_bert', NULL) ON CONFLICT (user_id, skill_id) DO NOTHING;
INSERT INTO user_skills (user_id, skill_id, version) VALUES ('bc6e88c8-0e0d-4c65-b3d6-7ee10cde6750', 'skill_linux', NULL) ON CONFLICT (user_id, skill_id) DO NOTHING;
