# Skill Sheet Maker

スキルシートの作成と管理のためのアプリケーションです。
Next.js, TypeScript, Prismaを使って構築されています。
技術スタックはVercelに乗せることを想定して作られています。

## Overview

もともとRust + Tauriのデスクトップアプリケーションとして作っていたものを、Vercelにデプロイして動かすことを目指して移行したプロジェクトです。

このアプリでは、エンジニア人材の登録・管理・スキルシートのPDF出力などを機能として含みます。

特徴的な機能：

- ユーザの管理
- 保有しているスキルと資格の情報の管理
- MBTI性格診断の結果の保持
- 業務経歴情報の保持
- スキルシートおよびサマリのPDF出力

## Tech Stack

- **フレームワーク**: Next.js 15, App Router
- **言語**: TypeScript
- **データベース**: PostgreSQL, Prisma ORM
- **スタイリング**: Tailwind CSS + daisyUI
- **デプロイ**: Vercel
- **アーキテクチャ**: Bulletproof-React

## 開発の始め方

### 必須要件

- Node.js 18+
- PostgreSQL database
- Git

### 環境構築

1. リポジトリのクローン:

```bash
git clone <repository-url>
cd skill-sheet-maker-ts
```

2. 依存関係のインストール:

```bash
npm install
```

3. 環境変数のセットアップ:

```bash
cp .env.example .env
```

`.env`を編集し、データベース接続文字列とその他の設定を記入する。

4. データベースのセットアップ:

```bash
npm run db:generate
npm run db:migrate
```

5. 開発サーバのスタート:

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開くことで実行結果を閲覧できます。

## スクリプト

- `npm run dev` - Turbopackで開発サーバを起動
- `npm run build` - 本番向けにビルド
- `npm run start` - 本番向けサーバの起動
- `npm run lint` - ESLintの実行
- `npm run lint:fix` - ESLintによるauto-fixの実行
- `npm run format` - Prettierによるコードのフォーマット
- `npm run type-check` - TypeScriptの型チェック実行
- `npm run db:generate` - Prisma clientの生成
- `npm run db:migrate` - database migrationsの実行
- `npm run db:studio` - Prisma Studioを開く
- `npm run db:seed` - Seed the database

## プロジェクト構成

```txt
src/
├── app/                 # Next.js App Router のページと API ルート
├── features/            # 機能単位のモジュール（Bulletproof-React 方式）
│   ├── users/           # ユーザー管理
│   ├── skills/          # スキル管理
│   └── auth/            # 認証
├── lib/                 # 共有ユーティリティと設定
├── components/          # 共有 UI コンポーネント
├── providers/           # アプリケーションプロバイダー
└── types/               # TypeScript の型定義

prisma/
└── schema.prisma        # データベーススキーマ
```

## データベーススキーマ

本アプリケーションは PostgreSQL を使用し、主なエンティティは以下のとおりです。

- Users（ユーザー）
- Skills と UserSkills（多対多）
- Qualifications（資格）
- MBTI Results（MBTI 結果）
- Career History（経歴）

## デプロイ

このアプリは Vercel でのデプロイに最適化されています。

1. GitHub リポジトリを Vercel に接続する
2. Vercel のダッシュボードで環境変数を設定する
3. `main` ブランチへの push で自動デプロイ

データベースには次のいずれかを検討してください。

- Vercel Postgres
- Neon
- PlanetScale
- その他の PostgreSQL プロバイダー
