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
#### tRPC採用の場合
- プロジェクトにtRPC関連パッケージ（@trpc/server, @trpc/next, @trpc/react等）を追加
- サーバ側にtRPC routerを定義（例：`src/server/routers/user.ts`）
- 機能ごとのルータ作成（userRouter: createUser, listUsers, updateUser, deleteUser等）
- Next.js App Router環境でRoute HandlerによるtRPCエンドポイント作成
- クライアント側でReact Hooks（useQuery, useMutation）をtRPC用に生成

#### REST API採用の場合
- `src/app/api/`以下にRESTエンドポイントを作成
- 例：`src/app/api/users/route.ts`（GETメソッド対応）
- ユーザ新規作成はPOSTメソッドで同じ`users/route.ts`内で処理
- ユーザ更新・削除は`users/[id]/route.ts`でHTTPメソッド毎に処理

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