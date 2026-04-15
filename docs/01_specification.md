# マニュアル作成管理・新人研修アプリ — 仕様書

## 1. プロダクト概要

### 1.1 ミッション

飲食店の「店長が教える時間」と「バイトが聞く時間」を徹底的に削減し、AIで代替する。

### 1.2 成功指標

| 指標 | 目標値 | 計測方法 |
|------|--------|----------|
| 店長のマニュアル作成時間 | 30秒以内 | AI対話の開始〜公開までの時間 |
| バイトの情報到達時間 | 3秒以内 | ホーム画面表示〜コンテンツ詳細表示までの時間 |
| バイトの操作ステップ | 2タップ以内 | カテゴリ選択 → コンテンツ詳細 |
| 検索結果表示 | 1秒以内 | 検索クエリ送信〜最初の結果描画 |

### 1.3 ユーザー

| ユーザー | 利用シーン | デバイス |
|----------|------------|----------|
| 店長（オーナー） | マニュアル作成・編集、配置管理 | スマホ（メイン）、PC |
| バイトスタッフ | マニュアル閲覧・検索 | スマホ（ほぼ100%） |

---

## 2. データモデル

### 2.1 エンティティ一覧

#### STORE（店舗）

| カラム | 型 | 説明 |
|--------|------|------|
| id | uuid (PK) | |
| name | text | 店舗名 |
| owner_id | uuid (FK → auth.users) | オーナーのSupabase Auth ID |
| slug | text (UNIQUE) | URL用スラッグ（例: `yakiniku-tanaka`） |
| created_at | timestamptz | |

#### CONTENT（コンテンツ — 旧MANUAL + RECIPE統合）

| カラム | 型 | 説明 |
|--------|------|------|
| id | uuid (PK) | |
| store_id | uuid (FK → STORE) | |
| title | text | タイトル |
| category | text | `recipe` `opening` `closing` `cleaning` `service` `equipment` `other` |
| tags | text[] | 自由タグ（配列） |
| summary | text | 一覧表示用の要約（1-2行） |
| search_text | text | 全ブロックのプレーンテキスト結合（検索用） |
| is_published | boolean | 公開フラグ（デフォルト true） |
| created_at | timestamptz | |
| updated_at | timestamptz | |

#### CONTENT_BLOCK（コンテンツブロック）

| カラム | 型 | 説明 |
|--------|------|------|
| id | uuid (PK) | |
| content_id | uuid (FK → CONTENT) | |
| sort_order | int | 表示順 |
| block_type | text | `text` `image` `video` `embed` `caution` |
| body_html | text | サニタイズ済みHTML（リッチテキスト、SVG図解等） |
| media_url | text | 画像・動画URL（Supabase Storage） |
| caution | text | 注意事項テキスト（block_type=caution時） |
| created_at | timestamptz | |

block_type の詳細:
- `text`: HTMLリッチテキスト。Claudeが生成した図解SVGもここに格納可能
- `image`: media_url に画像パスを格納。body_html にキャプション
- `video`: media_url に動画パスを格納
- `embed`: 外部埋め込みHTML（将来用）
- `caution`: 赤ボーダーで強調表示される注意事項

#### LOCATION（保管場所）

| カラム | 型 | 説明 |
|--------|------|------|
| id | uuid (PK) | |
| store_id | uuid (FK → STORE) | |
| label | text | 表示名（例: `冷蔵庫1`、`棚2`、`調理台A`） |
| area_type | text | `fridge` `freezer` `shelf` `counter` `storage` `other` |
| sort_order | int | 表示順 |
| created_at | timestamptz | |

#### ITEM（アイテム — 材料・資材）

| カラム | 型 | 説明 |
|--------|------|------|
| id | uuid (PK) | |
| store_id | uuid (FK → STORE) | |
| location_id | uuid (FK → LOCATION) | |
| name | text | アイテム名（例: `醤油`、`天ぷら粉`） |
| photo_url | text | 写真URL |
| notes | text | メモ |
| created_at | timestamptz | |

#### CONTENT_BLOCK_ITEM（ブロックとアイテムの紐づけ）

| カラム | 型 | 説明 |
|--------|------|------|
| block_id | uuid (FK → CONTENT_BLOCK) | 複合PK |
| item_id | uuid (FK → ITEM) | 複合PK |

### 2.2 リレーション

```
STORE 1──* CONTENT
STORE 1──* LOCATION
STORE 1──* ITEM
LOCATION 1──* ITEM
CONTENT 1──* CONTENT_BLOCK
CONTENT_BLOCK *──* ITEM  (via CONTENT_BLOCK_ITEM)
CONTENT *──* CONTENT     (自己参照: 関連コンテンツリンク)
```

### 2.3 検索戦略

Phase 1（MVP）: PostgreSQL 全文検索
- `search_text` カラムに全ブロックのプレーンテキストを結合して格納
- `pg_bigm` 拡張による `LIKE '%keyword%'` または `to_tsvector` による全文検索
- コンテンツ保存時に `search_text` を自動更新（トリガーまたはアプリ側）

Phase 2（将来）: pgvector セマンティック検索
- `search_embedding vector(1536)` カラムを追加
- コンテンツ保存時にembedding生成のバックグラウンドジョブ
- 「あの赤いソース」→「トマトソース」のような曖昧検索が可能に

---

## 3. 機能仕様

### 3.1 バイトモード（検索・閲覧）

#### F-B1: カテゴリ閲覧

- ホーム画面にカテゴリグリッド（3列）を表示
- カテゴリは色+アイコンで視覚的に瞬間判別
- タップでカテゴリ別コンテンツ一覧に遷移
- 「最近追加」セクションで新着コンテンツを表示

#### F-B2: テキスト検索

- ホーム画面の検索バーをタップで検索画面に遷移
- インクリメンタルサーチ（デバウンス300ms）
- 検索結果はカテゴリ色ドット + タイトル + サマリーで表示
- 結果タップでコンテンツ詳細に遷移

#### F-B3: コンテンツ詳細表示

- CONTENT_BLOCK を sort_order 順に描画
- block_type に応じたレンダリング:
  - `text`: HTMLをそのままレンダリング（DOMPurify通過済み）
  - `image`: 画像表示 + キャプション
  - `video`: 動画プレイヤー
  - `embed`: iframe or sanitized HTML
  - `caution`: 赤ボーダーのアラートカード
- ブロック内のITEM参照を自動でバッジ表示（アイテム名 + 場所）
- 関連コンテンツリンクをフッターに表示

#### F-B4: 場所から探す

- LOCATION 一覧を area_type ごとにグルーピング表示
- タップで場所内の ITEM 一覧
- 各 ITEM から関連する CONTENT へのリンク

### 3.2 店長モード（作成・編集）

#### F-O1: ダッシュボード

- 全コンテンツの一覧（カテゴリフィルタ、検索）
- 新規作成ボタン → AI対話画面
- 各コンテンツの編集・削除・公開/非公開切り替え
- コンテンツ数、カテゴリ別内訳の簡易統計

#### F-O2: AI対話によるコンテンツ生成

- チャットUI（メッセージ入力 + 音声入力）
- AIが対話を主導する構造:
  1. 「何のマニュアルですか？」→ カテゴリ自動判定
  2. 「材料・道具は？」→ ITEM テーブルから自動サジェスト（登録済みバッジ）
  3. 「手順を教えてください」→ 音声で説明 → AI が構造化
  4. 「注意事項は？」→ caution ブロックとして格納
  5. 「プレビューを確認」→ CONTENT_BLOCK 配列をプレビュー表示
  6. 「OK」→ CONTENT + CONTENT_BLOCK をDB保存、公開
- 未登録の材料名を検出した場合:
  - 「海老は場所が未登録です。どこに保管していますか？」
  - 回答に基づいて ITEM + LOCATION を自動登録
- AI生成の body_html は DOMPurify でサニタイズ後に格納

#### F-O3: コンテンツ編集

- ブロックエディタUI
  - CONTENT_BLOCK を sort_order 順にカード形式で表示
  - 各ブロックの直接テキスト編集（ContentEditable or textarea）
  - ブロックの並び替え（ドラッグ or 上下ボタン）
  - ブロックの追加・削除
  - 画像・動画のアップロード（Supabase Storage）
- AIアシスト編集:
  - 「このブロックをもっと簡潔にして」等の指示でAIが書き換え
  - ブロック単位でAIに再生成を依頼可能

#### F-O4: 配置管理

- LOCATION の CRUD（場所の追加・命名・削除）
- ITEM の CRUD（アイテムの追加・場所割り当て・写真登録）
- 場所ごとのアイテム一覧表示
- ドラッグでアイテムの場所移動

### 3.3 認証・認可

| 画面 | 認証 | 説明 |
|------|------|------|
| バイトモード全体 | 不要 | 店舗URLを知っていればアクセス可能 |
| 店長モード全体 | 必要 | Supabase Auth（メール + パスワード） |

- RLS（Row Level Security）で store_id ベースのアクセス制御
- バイト向けページは `anon` キーでの読み取りのみ許可
- 店長向けページは認証ユーザーかつ STORE.owner_id 一致を要求

---

## 4. 非機能要件

### 4.1 パフォーマンス

| 項目 | 目標 |
|------|------|
| ホーム画面の初期表示（LCP） | 1.5秒以内 |
| 検索結果表示 | 1秒以内 |
| コンテンツ詳細表示 | 1秒以内 |
| AI対話の初回応答（TTFB） | 1秒以内（ストリーミング） |

### 4.2 対応環境

- スマホ: iOS Safari 16+、Android Chrome 110+
- PC: Chrome 110+、Safari 16+、Edge 110+
- PWA対応（ホーム画面追加、オフラインキャッシュはPhase 2）

### 4.3 セキュリティ

- body_html は DOMPurify でサニタイズ（許可タグのホワイトリスト）
- Supabase RLS による行レベルセキュリティ
- 画像アップロードは Supabase Storage のポリシーで store_id 制限
- CORS 設定はアプリドメインのみ許可

---

## 5. 技術スタック

| レイヤー | 技術 | 理由 |
|----------|------|------|
| フレームワーク | Next.js 15 (App Router) | RSC + Server Actions で高速表示 |
| UI | React 19 + Tailwind CSS 4 | ユーティリティCSS で高速開発 |
| 状態管理 | Zustand | 軽量、ボイラープレート最小 |
| DB | Supabase (PostgreSQL) | RLS、Auth、Storage が統合 |
| ストレージ | Supabase Storage | 画像・動画の保存 |
| AI | Claude API (Streaming) | 対話生成 + コンテンツ生成 |
| 音声 | Web Speech API | ブラウザ標準、追加コストなし |
| ホスティング | Vercel | Next.js 最適化、Edge Runtime |
| サニタイズ | DOMPurify | HTML ホワイトリスト制御 |

---

## 6. 実装フェーズ

### Sprint 1（P0 — 2週間）

バイトが「開いて、探して、見る」最小ループ

- `/` ホーム画面（カテゴリグリッド + 検索バー）
- `/c/[category]` カテゴリ別一覧
- `/m/[id]` コンテンツ詳細表示
- `/search` テキスト検索
- Supabase テーブル作成 + シードデータ
- Vercel デプロイ

### Sprint 2（P0 — 2週間）

店長がAI対話でコンテンツを作る最小ループ

- `/owner` ダッシュボード
- `/owner/create` AI対話でコンテンツ生成
- Claude API 連携（ストリーミング）
- 音声入力（Web Speech API）
- Supabase Auth セットアップ

### Sprint 3（P1 — 2週間）

編集と配置管理

- `/owner/edit/[id]` ブロックエディタ
- `/owner/locations` 場所 + アイテム管理
- `/locations` バイト向け場所一覧
- `/locations/[id]` 場所内アイテム一覧
- 画像アップロード

### Sprint 4（P2 — 以降）

- PWA オフライン対応
- pgvector セマンティック検索
- AI検索エージェント（バイト向けチャット）
- 利用ログ収集・分析
- マルチ店舗対応
