const { execSync } = require('child_process');

// 1. テーブル存在＆TRUNCATE
execSync('node scripts/check-master-truncate.cjs', { stdio: 'inherit' });

// 2. マスター生成スクリプト
execSync('npm run gen:skills-inserts', { stdio: 'inherit' });
execSync('npm run gen:qualification-inserts', { stdio: 'inherit' });
execSync('npm run gen:mbti-inserts', { stdio: 'inherit' });

// 3. INSERT
execSync('npm run insert:skills-test', { stdio: 'inherit' });
execSync('npm run insert:qualifications-test', { stdio: 'inherit' });
execSync('npm run insert:mbti-master-test', { stdio: 'inherit' });
execSync('npm run insert:skills-prod', { stdio: 'inherit' });
execSync('npm run insert:qualifications-prod', { stdio: 'inherit' });
execSync('npm run insert:mbti-master-prod', { stdio: 'inherit' });
