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

### データベーススキーマの変更管理

このプロジェクトではPrisma ORMを使用してデータベーススキーマを管理しています。テーブル構造や型の変更は以下の手順で行います。

#### 1. スキーマファイルの編集

`prisma/schema.prisma`ファイルを編集してスキーマを変更します：

```prisma
// 例：新しいテーブルの追加
model Statistics {
  id        String   @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  userId    String   @map("user_id") @db.Uuid
  viewCount Int      @default(0) @map("view_count")
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt DateTime @updatedAt @map("updated_at") @db.Timestamptz

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("statistics")
}

// 例：既存テーブルへのカラム追加
model User {
  // ... 既存のフィールド
  lastLoginAt DateTime? @map("last_login_at") @db.Timestamptz // 新規追加
  loginCount  Int       @default(0) @map("login_count")      // 新規追加

  // ... リレーション
  statistics Statistics[] // 新規リレーション
}
```

#### 2. マイグレーションの作成と適用

```bash
# 開発環境でのマイグレーション（データベース変更 + Prisma Client更新）
npm run db:migrate

# マイグレーション名を指定する場合
npx prisma migrate dev --name add_user_statistics

# スキーマを直接プッシュ（開発時のみ、マイグレーション履歴なし）
npx prisma db push
```

#### 3. Prisma Clientの再生成

スキーマ変更後は必ずPrisma Clientを再生成：

```bash
npm run db:generate
```

#### 4. TypeScriptコードの更新

新しいフィールドやテーブルに対応するAPIエンドポイントやコンポーネントを更新：

```typescript
// API例：src/app/api/users/[id]/statistics/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const userStats = await prisma.statistics.findMany({
    where: { userId: id },
    include: {
      user: {
        select: { name: true },
      },
    },
  });

  return NextResponse.json({ success: true, data: userStats });
}
```

#### 5. 本番環境への適用

本番環境でのマイグレーション実行：

```bash
# 本番データベースでのマイグレーション適用
npx prisma migrate deploy

# データベース接続確認
npx prisma db seed  # 必要に応じて
```

#### 6. マイグレーションの注意点

##### ⚠️ データの互換性

- **破壊的変更**（カラム削除、型変更）は慎重に行う
- 既存データとの互換性を検証する
- 必要に応じてデータ移行スクリプトを作成

##### ⚠️ 本番環境での注意

- 本番適用前にステージング環境でテスト
- バックアップを取得してから実行
- ダウンタイムが発生する場合は事前告知

##### ✅ 推奨パターン

```bash
# 1. 機能開発ブランチで変更
git checkout -b feature/add-statistics

# 2. スキーマ変更
vim prisma/schema.prisma

# 3. マイグレーション作成
npm run db:migrate

# 4. コード更新
# APIやフロントエンドコードを更新

# 5. テスト実行
npm run type-check
npm run build

# 6. コミット
git add .
git commit -m "feat: add user statistics tracking"

# 7. プルリクエスト作成・レビュー・マージ
```

#### 7. よく使用するマイグレーション操作

```bash
# マイグレーション状態確認
npx prisma migrate status

# マイグレーション履歴表示
npx prisma migrate history

# 特定のマイグレーションまでロールバック（注意：データ損失の可能性）
npx prisma migrate resolve --rolled-back <migration-name>

# マイグレーションの手動マーク（適用済みとしてマーク）
npx prisma migrate resolve --applied <migration-name>

# データベースリセット（開発環境のみ）
npx prisma migrate reset
```

#### 8. 統計情報・ログテーブルの設計例

将来的な統計情報やログ機能のためのテーブル例：

```prisma
// アクセスログ
model AccessLog {
  id        String   @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  userId    String?  @map("user_id") @db.Uuid
  endpoint  String
  method    String
  statusCode Int     @map("status_code")
  responseTime Int  @map("response_time")
  ipAddress String  @map("ip_address")
  userAgent String? @map("user_agent")
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz

  user User? @relation(fields: [userId], references: [id])

  @@map("access_logs")
}

// アプリケーション統計
model AppStatistics {
  id          String   @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  date        DateTime @db.Date
  totalUsers  Int      @map("total_users")
  activeUsers Int      @map("active_users")
  newUsers    Int      @map("new_users")
  apiCalls    Int      @map("api_calls")
  createdAt   DateTime @default(now()) @map("created_at") @db.Timestamptz

  @@unique([date])
  @@map("app_statistics")
}
```

この手順に従うことで、データベースの変更を安全かつ追跡可能な方法で管理できます。

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
