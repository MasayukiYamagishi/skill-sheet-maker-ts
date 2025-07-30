// scripts/update-migrations.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const schemaPath = path.resolve(__dirname, '../db/schema.sql');
const migrationsDir = path.resolve(__dirname, '../migrations');

// 1. マイグレーションファイル作成
const now = new Date();
const yyyymmddhhmmss =
  now.getFullYear().toString() +
  String(now.getMonth() + 1).padStart(2, '0') +
  String(now.getDate()).padStart(2, '0') +
  String(now.getHours()).padStart(2, '0') +
  String(now.getMinutes()).padStart(2, '0') +
  String(now.getSeconds()).padStart(2, '0');
const migrationName = `${yyyymmddhhmmss}_auto_from_schema.sql`;

execSync(`sqlx migrate add auto_from_schema -r`, { stdio: 'inherit' });

// 2. schema.sql の内容を最新のマイグレーションファイルに上書き
// 最新ファイル（降順）を探す
const migrationFiles = fs
  .readdirSync(migrationsDir)
  .filter((f) => f.endsWith('.sql'))
  .map((f) => ({
    file: f,
    time: fs.statSync(path.join(migrationsDir, f)).mtime.getTime(),
  }))
  .sort((a, b) => b.time - a.time);

const latestMigrationFile = path.join(migrationsDir, migrationFiles[0].file);
const schemaContent = fs.readFileSync(schemaPath, 'utf8');
fs.writeFileSync(latestMigrationFile, schemaContent, 'utf8');

console.log(`> Updated migration: ${latestMigrationFile}`);
