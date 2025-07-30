const { execSync } = require('child_process');

function run(cmd, options = {}) {
  console.log(`\n=== 実行: ${cmd} ===`);
  execSync(cmd, { stdio: 'inherit', ...options });
}

function main() {
  // 1. テストDBと本番DBのダミーデータクリア（TRUNCATE）
  run('npm run clear:dummy-user-data-test');
  run('npm run clear:dummy-user-data-prod');

  // 2. INSERT SQLファイルの生成（genコマンド）
  run('npm run gen:dummy-user-inserts');
  run('npm run gen:dummy-user-qualifications');
  run('npm run gen:dummy-user-skills');
  run('npm run gen:dummy-career-histories');
  run('npm run gen:dummy-career-process');
  run('npm run gen:dummy-career-skills');

  // 3. テストDBに順番にINSERT
  run('npm run insert:dummy-user-test');
  run('npm run insert:dummy-user-qualifications-test');
  run('npm run insert:dummy-user-skills-test');
  run('npm run insert:dummy-career-history-test');
  run('npm run insert:dummy-career-process-test');
  run('npm run insert:dummy-career-skills-test');

  // 4. 本番DBにも順番にINSERT
  run('npm run insert:dummy-user-prod');
  run('npm run insert:dummy-user-qualifications-prod');
  run('npm run insert:dummy-user-skills-prod');
  run('npm run insert:dummy-career-history-prod');
  run('npm run insert:dummy-career-process-prod');
  run('npm run insert:dummy-career-skills-prod');
}

main();
