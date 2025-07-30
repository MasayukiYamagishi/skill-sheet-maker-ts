\encoding UTF8;
-- INSERT INTO user_qualifications
INSERT INTO user_qualifications (user_id, qualification_id, acquired_at) VALUES ('08250bb6-60a3-4e65-b0e6-dff9971c15f1', 'q_basic_information_technology_engineer', '2007-10-01') ON CONFLICT (user_id, qualification_id) DO NOTHING;
INSERT INTO user_qualifications (user_id, qualification_id, acquired_at) VALUES ('08250bb6-60a3-4e65-b0e6-dff9971c15f1', 'q_applied_information_technology_engineer', '2010-04-01') ON CONFLICT (user_id, qualification_id) DO NOTHING;
INSERT INTO user_qualifications (user_id, qualification_id, acquired_at) VALUES ('08250bb6-60a3-4e65-b0e6-dff9971c15f1', 'q_information_security_support', '2015-04-01') ON CONFLICT (user_id, qualification_id) DO NOTHING;
INSERT INTO user_qualifications (user_id, qualification_id, acquired_at) VALUES ('08250bb6-60a3-4e65-b0e6-dff9971c15f1', 'q_g_test', '2018-07-01') ON CONFLICT (user_id, qualification_id) DO NOTHING;
