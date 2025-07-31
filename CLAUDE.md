# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

このプロジェクトは**スキルシート管理システム**で、日本のIT業界向けに設計されています。Rust+Tauriのデスクトップアプリケーションから、Vercel上で動作する完全なTypeScriptベースのウェブアプリケーションに移行されました。Next.js（App Router）を採用し、フロントエンドとバックエンドを統合してVercelにデプロイします。ORMにはPrismaを使用し、Edge Runtimeを活用できる部分はEdge Function化してグローバルに高速配信します。

### 移行戦略の背景

- **Vercel親和性**: Rust/TauriバックエンドはVercelではそのまま動作せず、サーバレス/Edge環境で動作するTypeScriptコードへの置き換えが最優先
- **統合デプロイ**: Next.js App RouterとEdge Runtimeを用いて、フロントエンドとAPIバックエンドを同一プロジェクト内に統合
- **既存機能のサービス化**: 現行アプリの各種コマンド（ユーザCRUD、スキル情報取得など）をNext.jsのAPI RouteまたはtRPCルーターとして実装

## 技術アーキテクチャ

### 技術スタック

- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS + daisyUI
- **Backend**: Next.js API routes (serverless functions)
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Vercel最適化
- **Structure**: Bulletproof-React アーキテクチャパターン

### Edge Runtime活用

- Next.jsはデフォルトでNode.jsランタイムで動作するが、Edge Functionsとして動かすことでグローバル展開・低遅延化が可能
- App Routerの route.ts ごとに `export const runtime = 'edge'` と指定すればEdge Runtime上で関数を実行可能
- **制約事項**: Edge RuntimeではNode.jsの標準モジュールが使用不可（例：pg、Node版Crypto）
- **解決策**: Prisma + Vercel Postgresのようなエッジ対応手段、または一部処理はNode.js Runtime（サーバレス関数）で動作

### ディレクトリ構成（Bulletproof-React準拠）

```
src/
├── app/           # Next.js App Router (pages + API routes)
├── features/      # 機能別モジュール (users, skills, auth)
├── lib/           # 共通ユーティリティ (Prisma client, etc.)
├── components/    # 共通UIコンポーネント
├── types/         # TypeScript型定義
prisma/            # データベーススキーマとマイグレーション
public/reference/  # マスターデータ (skills, qualifications, MBTI)
```

### 機能モジュールパターン

`src/features/` 内の各機能は以下の構造に従います：

- `api/` - API統合関数
- `components/` - 機能固有のUIコンポーネント
- `hooks/` - カスタムReactフック
- `index.ts` - バレルエクスポート

### フロントエンド統合戦略

- 既存のReact+TypeScriptコードをNext.jsプロジェクトに組み込み
- ルーティングをReact RouterからNext.jsのルーティングに置き換え
- 既存のVite設定をNext.jsに合わせて調整
- CSSフレームワーク（tailwindcss + daisyUI）はそのまま利用可能

## 開発コマンド

### 基本開発

```bash
npm run dev              # 開発サーバー起動 (Turbopack付き)
npm run build            # プロダクションビルド
npm run type-check       # TypeScriptコンパイルチェック
npm run lint             # ESLintチェック
npm run format           # Prettierフォーマット
```

### データベース操作

```bash
npm run db:generate      # スキーマ変更後のPrismaクライアント生成
npm run db:migrate       # マイグレーション作成・適用
npm run db:studio        # Prisma Studio GUI起動
```

### データ管理（重要）

プロジェクトには豊富なデータシード機能が含まれています：

#### マスターデータ生成（JSONリファレンスファイルから）

```bash
npm run gen:skills-inserts           # スキルマスターSQL生成
npm run gen:qualification-inserts    # 資格マスターSQL生成
npm run gen:mbti-inserts            # MBTIマスターSQL生成
```

#### データベース投入（test/prod環境対応）

```bash
npm run insert:skills-test          # テスト環境へスキル投入
npm run insert:qualifications-prod  # プロダクション環境へ資格投入
npm run run:all-dummy-user-data     # 全てのダミーユーザーデータ投入
```

#### データクリーンアップ

```bash
npm run clear:dummy-user-data-test  # テスト環境のダミーデータ削除
```

## データベーススキーマ

### 主要エンティティ

- **User**: メインエンティティ（プロフィール、MBTI、雇用状況）
- **Skill**: 技術スキルのマスターデータ（カテゴリ付き）
- **UserSkill**: 多対多リレーション（習熟度レベル1-5）
- **Qualification**: 職業資格
- **MBTIResult**: 性格診断結果
- **CareerHistory**: 職歴レコード

### 重要なリレーションシップ

- User ↔ UserSkill ↔ Skill (レベル追跡付き多対多)
- User → MBTIResult (一対多)
- User → CareerHistory (一対多)

### Prismaマイグレーション戦略

- 既存のRust sqlxマイグレーション履歴からPrismaマイグレーションへの移行
- テスト環境用と本番環境用の2つのDB（users_test, users_prod）をサポート
- Prisma Clientはサーバレス/エッジ環境で動作（Prisma Data ProxyやNeon経由）

## 開発パターン

### データベースアクセス

- `src/lib/prisma.ts`を使用（サーバレス用シングルトンパターン）
- スキーマ変更後は必ず`npm run db:generate`を実行
- 環境変数によるtest/prod データベースの分離サポート

### API実装パターン

#### REST APIによる実装

- `src/app/api/`以下にRESTエンドポイントを作成
- 例：`src/app/api/users/route.ts`（GETメソッド対応）
- ユーザ新規作成はPOSTメソッドで同じ`users/route.ts`内で処理
- ユーザ更新・削除は`users/[id]/route.ts`でHTTPメソッド毎に処理

#### OpenAPI規格に則る

APIの実装においては、OpenAPIの規格に則って実装を進めること。

### コンポーネント開発

- daisyUIコンポーネントパターンを使用（UI一貫性）
- TypeScript strict モード使用（コミット前type-check）
- Tailwind CSSでレスポンシブデザイン実装
- 共通コンポーネントは`src/components/`に格納

### 既存Rustロジックの再現

- Rust側のビジネスロジック（例：「activeなユーザ数カウント」や「MBTIタイプ詳細取得」）をTS側で忠実に再現
- Rust実装を読み解き、同等のSQLクエリや処理をPrismaクエリやTSロジックに置換
- クリーンアーキテクチャ風にapplication/domain層が存在する場合、その知見を活かしてTS側でもサービス層を設置

## ビジネスコンテキスト

### 日本のIT業界向け機能

- **スキルシート**: クライアント向けプロフィール資料作成
- **ステータス種別**: 案件参画中、営業中、休職中、離職済み
- **工程フェーズ**: 要件定義、基本設計、詳細設計、プログラミング、テスト等
- **技術カテゴリ**: IT技術の包括的分類体系

### マスターデータ管理

`/public/reference/`にマスターデータを格納：

- `skills.json` - 包括的技術スキルカタログ
- `qualifications.json` - 職業資格標準
- `mbti.json` - 性格タイプ定義
- 開発用各種ダミーデータファイル

### ファイルアップロード対応

- **Vercel Blob活用**: ユーザのプロフィール画像等バイナリデータ管理
- Vercel Blobは画像・動画等のファイルを最適化して保存するマネージドストレージ
- サーバ側でBlob SDKを使って画像をアップロード・取得するAPI実装
- 画像URL等をPrisma経由でユーザプロフィールに紐付け

## 重要な考慮事項

### 移行コンテキスト

Rust+Tauri → TypeScript移行のため：

- 一部のビジネスロジックパターンは元のRust実装を反映している可能性
- 日本のビジネス要件がデータモデルを駆動
- データ構造の互換性維持に重点

### 認証基盤の準備

- **NextAuth.js (Auth.js)**: 将来的なログイン機能追加を見据えた下準備
- 環境変数にGitHubやGoogle OAuthクレデンシャルを登録
- ディレクトリ構成上`src/app/api/auth/[...nextauth]/route.ts`を配置可能に
- Edge Runtime上でNextAuthを動かすにはミドルウェアと本体を分離する工夫が必要
- Protected RouteのためのMiddleware (`middleware.ts`) 配置検討

### PDF生成機能

- **Vercel上でPDF生成可能**: サーバレス関数でヘッドレスブラウザ（Chromium）を動作
- **制約**: そのままのpuppeteerは大容量Chromiumバイナリを含むためVercel（AWS Lambda 50MB制限）では動作不可
- **解決策**: 軽量版Chromiumとpuppeteer-coreを使用（例：@sparticuz/chromium + puppeteer-core）
- Vercel Function内でHTMLをレンダリングしてPDFバッファを生成し、適切なHTTPヘッダでダウンロードレスポンス

### パフォーマンス最適化

- UserSkillの多対多リレーションシップ向けデータベースクエリ最適化
- リファレンスデータのキャッシュ戦略検討
- 適切な箇所でVercel Edge Functions活用
- Edge化した関数のサイズ監視（Vercel Edge関数はデプロイサイズ上限1MB程度）

### セキュリティ・運用考慮

- APIルートが認証無しで公開される状態のため、将来的な認証導入までの暫定措置を検討
- 社内ツールであればIP制限やBasic認証を一時的に適用
- ビルド後のVercelデプロイで各関数のレスポンス性能やCold Start時間を計測

### 型安全性

- 全データベースモデルはPrismaで厳密に型定義
- アプリケーション全体でPrisma生成型を使用
- 共有インターフェースは`src/types/`で型定義維持

## 必要なAPI

必要となると考えられるAPIの一覧と機能をまとめたもの。
内容は確実なものではなく、ほぼ確実に必要になるであろう機能を簡潔にまとめたものであり、例えばアップサート処理や新規登録、更新処理の作りをより良いものに改善できるのであればより良いよ考えられる処理を優先してよい。
基本的にはフィルタリングを施したデータを返却するAPIなどは提供せず、それぞれCRUDあるいは一覧/参照のAPIのみを実装するという方針で良い。

- **ユーザ情報**
  - usersテーブル：ユーザの情報が登録されたテーブル。CRUD APIが必要。
    - fetch_all_users：ユーザ情報全件取得
    - fetch_user_by_id：指定したIDのユーザ情報を取得する（1件ずつ）
    - insert_user：ユーザ新規登録（1件ずつ。重複はスキップする）
    - update_user_by_id：指定したIDのユーザ情報を更新する（1件ずつ）
    - delete_user_by_ids：指定したIDのユーザ情報を削除する（単一削除および複数件まとめて削除が可能）
- **スキル関連**
  - skillsテーブル：スキルの情報が保存されたテーブル。一覧/参照APIが必要。
    - fetch_all_skills：全スキル情報を取得する
    - fetch_skill_by_ids：IDでスキルを検索して取得する（単一取得および複数件まとめて取得が可能）
  - skill_tagsテーブル：スキルに付与されるタグの情報がまとまったテーブル。一覧/参照 APIが必要。
    - fetch_all_skill_tags：スキルタグ情報全件取得
    - fetch_skill_tag_by_id：指定したスキルIDのタグ情報を取得する（単一取得および複数件まとめて取得が可能）
  - skill_tag_mapテーブル：スキルとタグの対応関係をまとめてあるテーブル。一覧/参照 APIが必要。
    - fetch_all_skill_tag_maps：全スキルタグマップを取得する。
    - fetch_skill_tag_maps_by_skill_id：スキルIDを使ってスキルタグマップを検索し、スキルに紐づくタグの情報を取得する（単一取得および複数件まとめて取得が可能）
    - fetch_skill_tag_maps_by_tag_id：タグIDを使ってスキルタグマップを検索し、指定されたIDのタグを持ったスキル一覧を取得する（単一取得および複数件まとめて取得が可能）
  - skill_categoriesテーブル：各スキルを分類するためのカテゴリを定義したテーブル。一覧/参照 APIが必要。
    - fetch_all_skill_categories：全スキルカテゴリを取得する。
    - fetch_skill_category_by_id：指定したIDのカテゴリを取得する（単一取得および複数件まとめて取得が可能）
  - user_skill：各ユーザが持つスキルを、ユーザUUIDに紐づけて保存しているテーブル。CRUD APIが必要。更新の処理はアップサートにまとめられそうならまとめてもよい。
    - fetch_user_skills_by_user_id：指定したユーザUUIDのユーザが持つスキル一覧を取得する。
    - insert_user_skills：指定したUUIDのユーザにスキルを（単数/複数まとめて）登録する。重複はスキップする。
    - update_user_skill：指定したUUIDのユーザが持つ指定したスキルIDのスキルのバージョン情報を更新する（単数/複数可）
    - delete_user_skills：指定したUUIDのユーザが持つ指定したスキルIDのスキルを削除する（単数/複数削除が可能）
- **資格関連**
  - qualificationsテーブル：資格の詳細情報を定義したテーブル。一覧/参照 APIが必要。更新の処理はアップサートにまとめられそうならまとめてもよい。
    - fetch_all_qualifications：すべての資格情報を取得する。
    - fetch_qualification_by_ids：指定したIDの資格情報を取得する（単数/複数まとめて取得が可能）
  - user_qualificationsテーブル：各ユーザが保有している資格情報をまとめたテーブル。CRUD APIが必要。
    - fetch_user_qualifications_by_user_id：指定したユーザUUIDのユーザが保有している全ての資格情報を取得する。
    - insert_user_qualifications：指定したユーザUUIDのユーザに資格情報を新規登録する（単数/複数可。重複はスキップする）
    - upsert_user_qualification：指定したユーザUUIDのユーザが保有している資格情報の取得年月日を更新する。（単数/複数可）
    - delete_user_qualifications：指定したユーザUUIDのユーザの、指定した資格IDの資格情報を削除する（単数/複数可）
- **経歴関連**
  - career_historiesテーブル：ユーザがもつ経歴情報テーブル。CRUD APIが必要。
    - fetch_career_history_by_user_id：指定したユーザUUIDのユーザの経歴情報を全件取得する。
    - fetch_career_history_by_ids：指定したUUIDのユーザの、指定した経歴UUIDの経歴情報を取得する（単数/複数可）
    - insert_career_histories：指定したUUIDのユーザに経歴情報を新規登録する（単数/複数可）
    - update_career_histories：指定したUUIDのユーザが持つ、指定したUUIDの経歴情報の内容を更新する（単数/複数可）
    - delete_career_histories：指定したUUIDのユーザが持つ、指定したUUIDの経歴情報を削除する（単数/複数可）
  - career_skillsテーブル：各経歴に紐づいた、利用したスキルをまとめたテーブル。CRUD APIが必要。
    - fetch_career_skills_by_career_ids：指定したUUIDの経歴情報に紐づいているスキルの一覧を取得する。（単数/複数可）
    - upsert_career_skills：指定したUUIDの経歴情報に、指定したIDのスキルがなければスキル情報を登録し、指定したIDのスキルがあれば内容を更新する（単数/複数可のアップサート処理）
    - delete_career_skills：指定したUUIDの経歴情報に紐づく、指定したIDのスキル情報を削除する（単数/複数可）
  - career_processesテーブル：各経歴に紐づいた、担当工程をまとめたテーブル。CRUD APIが必要。担当工程は、各経歴それぞれの担当工程について「担当した or 担当していない」という情報がリクエストとして与えられるので、それに応じて内容を更新する必要がある。マルチセレクトのチェックボックスで担当工程をフォーム入力するイメージ。
    - fetch_career_processes_by_career_ids：指定したUUIDの経歴情報に紐づいている担当工程の情報をまとめて全件取得（career_idは単数/複数可。各経歴UUIDごとに、担当した工程の情報をまとめたオブジェクトを返却する）
    - upsert_career_processes：指定したUUIDの経歴情報に、指定した担当工程がなければ担当工程を追加し、指定した担当工程があれば内容を更新する。
    - delete_career_processes：指定したUUIDの経歴情報に紐づいている指定した番号の担当工程を削除する。（単数/複数可）
- **MBTI関連**
  - mbti_groupsテーブル：MBTIの「分析家」「外交官」などの大分類をまとめて定義したテーブル。一覧/参照 APIが必要。
    - fetch_mbti_group_by_id：指定されたIDのMBTI大分類の情報を取得する。（単一）
  - mbti_typesテーブル：MBTI性格16タイプごとの詳細情報をまとめて定義したテーブル。一覧/参照 APIが必要。
    - fetch_mbti_detail_by_type：指定したcodeのMBTIタイプの詳細情報を取得する。（単一）
  - mbti_identitiesテーブル：MBTIのA/T型区分の情報をまとめたテーブル。一覧/参照 APIが必要。
    - fetch_mbti_identity_by_code：指定したAまたはTのコードから、性格区分の詳細情報を取得する。（単一）
