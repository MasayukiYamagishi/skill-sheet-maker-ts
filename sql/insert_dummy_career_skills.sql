\encoding UTF8;
-- INSERT INTO career_skills
INSERT INTO career_skills (career_id, skill_id, version) VALUES ('37007123-8499-40de-bad9-167af720203d', 'skill_python', '3.6') ON CONFLICT (career_id, skill_id) DO NOTHING;
INSERT INTO career_skills (career_id, skill_id, version) VALUES ('37007123-8499-40de-bad9-167af720203d', 'skill_pytorch', '1.4') ON CONFLICT (career_id, skill_id) DO NOTHING;
INSERT INTO career_skills (career_id, skill_id, version) VALUES ('37007123-8499-40de-bad9-167af720203d', 'skill_linux', NULL) ON CONFLICT (career_id, skill_id) DO NOTHING;
INSERT INTO career_skills (career_id, skill_id, version) VALUES ('9cd2aefe-e73a-4229-8514-47412407352b', 'skill_python', '3.8') ON CONFLICT (career_id, skill_id) DO NOTHING;
INSERT INTO career_skills (career_id, skill_id, version) VALUES ('9cd2aefe-e73a-4229-8514-47412407352b', 'skill_bert', NULL) ON CONFLICT (career_id, skill_id) DO NOTHING;
INSERT INTO career_skills (career_id, skill_id, version) VALUES ('9cd2aefe-e73a-4229-8514-47412407352b', 'skill_postgresql', '12') ON CONFLICT (career_id, skill_id) DO NOTHING;
