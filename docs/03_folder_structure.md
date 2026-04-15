# マニュアル作成管理・新人研修アプリ — フォルダ構成

## 設計原則

4層のレイヤード・アーキテクチャで責務を分離する。

```
UI層（components/）  → 見た目だけ。ロジックを持たない
機能層（features/）  → 画面固有のロジック。hooks + 状態管理
ドメイン層（lib/）   → ビジネスロジック。フレームワーク非依存
通信層（services/）  → 外部API・DB通信。データの入出力
```

依存方向: `components → features → lib → services`
逆方向の依存は禁止。

---

## ディレクトリツリー

```
src/
├── app/                          # Next.js App Router（ルーティングのみ）
│   ├── layout.tsx                # ルートレイアウト（フォント、メタ）
│   ├── page.tsx                  # B1: ホーム（カテゴリグリッド + 検索バー）
│   │
│   ├── search/
│   │   └── page.tsx              # B2: 検索
│   │
│   ├── c/
│   │   └── [category]/
│   │       └── page.tsx          # B3: カテゴリ一覧
│   │
│   ├── m/
│   │   └── [id]/
│   │       └── page.tsx          # B4: コンテンツ詳細
│   │
│   ├── locations/
│   │   ├── page.tsx              # B5: 場所一覧
│   │   └── [id]/
│   │       └── page.tsx          # B6: 場所内アイテム
│   │
│   ├── owner/
│   │   ├── layout.tsx            # 店長モード共通レイアウト（認証ガード）
│   │   ├── page.tsx              # O1: ダッシュボード
│   │   ├── create/
│   │   │   └── page.tsx          # O2: AI対話作成
│   │   ├── edit/
│   │   │   └── [id]/
│   │   │       └── page.tsx      # O3: ブロックエディタ
│   │   └── locations/
│   │       └── page.tsx          # O4: 配置管理
│   │
│   ├── login/
│   │   └── page.tsx              # C1: ログイン
│   │
│   └── api/                      # Route Handlers（API層）
│       ├── chat/
│       │   └── route.ts          # AI対話エンドポイント（ストリーミング）
│       ├── content/
│       │   ├── route.ts          # CONTENT CRUD
│       │   └── [id]/
│       │       └── route.ts      # CONTENT 個別操作
│       ├── search/
│       │   └── route.ts          # 検索エンドポイント
│       ├── locations/
│       │   └── route.ts          # LOCATION CRUD
│       └── items/
│           └── route.ts          # ITEM CRUD
│
├── components/                   # ========== UI層 ==========
│   │                             # 見た目のみ。props で受け取り、描画する。
│   │                             # hooks の呼び出し禁止（features 層が担当）。
│   │                             # ただし useState 等の純UIステートは許可。
│   │
│   ├── ui/                       # 汎用UIプリミティブ
│   │   ├── Badge.tsx             # カテゴリ色バッジ、ステータスバッジ
│   │   ├── BackButton.tsx        # 戻るボタン
│   │   ├── Button.tsx            # ボタン（variant: primary, secondary, danger）
│   │   ├── Card.tsx              # 汎用カード
│   │   ├── EmptyState.tsx        # 空状態の表示
│   │   ├── Input.tsx             # テキスト入力
│   │   ├── Spinner.tsx           # ローディングスピナー
│   │   └── VoiceButton.tsx       # マイクボタン（Web Speech API）
│   │
│   ├── layout/                   # レイアウト
│   │   ├── AppLayout.tsx         # バイトモード用（軽量、ナビなし）
│   │   └── OwnerLayout.tsx       # 店長モード用（サイドナビ or タブバー）
│   │
│   ├── content/                  # コンテンツ表示
│   │   ├── CategoryGrid.tsx      # カテゴリの3列グリッド
│   │   ├── ContentCard.tsx       # 一覧用のコンテンツカード
│   │   ├── ContentList.tsx       # ContentCard の縦並びリスト
│   │   ├── ContentHeader.tsx     # 詳細画面のヘッダー
│   │   ├── BlockRenderer.tsx     # block_type による描画分岐
│   │   ├── RecentList.tsx        # 新着コンテンツリスト
│   │   ├── RelatedContents.tsx   # 関連コンテンツリンク
│   │   └── blocks/               # ブロック種別ごとのレンダラー
│   │       ├── TextBlock.tsx     # HTML リッチテキスト描画
│   │       ├── ImageBlock.tsx    # 画像 + キャプション
│   │       ├── VideoBlock.tsx    # 動画プレイヤー
│   │       ├── CautionBlock.tsx  # 赤ボーダー注意カード
│   │       └── EmbedBlock.tsx    # SVG図解等の埋め込み
│   │
│   ├── search/                   # 検索UI
│   │   ├── SearchBar.tsx         # ホーム用の検索バー（タップで遷移）
│   │   ├── SearchInput.tsx       # 検索画面の入力欄（自動フォーカス）
│   │   ├── SearchResults.tsx     # コンテンツ検索結果リスト
│   │   └── ItemSearchResults.tsx # アイテム検索結果（場所情報つき）
│   │
│   ├── location/                 # 場所表示
│   │   ├── LocationCard.tsx      # 場所カード（名前 + アイテム数）
│   │   └── LocationGroup.tsx     # area_type ごとのグループ
│   │
│   ├── item/                     # アイテム表示
│   │   ├── ItemCard.tsx          # 写真 + 名前 + 関連コンテンツ
│   │   └── ItemBadge.tsx         # アイテム名 + 場所のインラインバッジ
│   │
│   ├── chat/                     # AI対話UI
│   │   ├── ChatContainer.tsx     # メッセージリストのスクロール管理
│   │   ├── AiMessage.tsx         # AIアバター + メッセージ
│   │   ├── UserMessage.tsx       # ユーザーメッセージ（右寄せ）
│   │   ├── ChatInput.tsx         # テキスト入力 + 音声ボタン
│   │   ├── ItemSuggestionBadge.tsx # ITEM自動検出バッジ
│   │   └── PreviewPanel.tsx      # 生成中コンテンツのプレビュー
│   │
│   ├── editor/                   # ブロックエディタUI
│   │   ├── BlockEditor.tsx       # ブロック一覧 + 並び替え
│   │   ├── EditableTextBlock.tsx # テキスト編集
│   │   ├── EditableCautionBlock.tsx
│   │   ├── EditableImageBlock.tsx
│   │   ├── BlockToolbar.tsx      # ドラッグ・削除・AIアシスト
│   │   └── AddBlockMenu.tsx      # ブロック種別選択
│   │
│   └── owner/                    # 店長ダッシュボードUI
│       ├── StatCards.tsx          # コンテンツ数の統計カード
│       ├── CreateButton.tsx       # AI新規作成CTA
│       ├── CategoryFilter.tsx     # カテゴリフィルタのピル
│       └── ContentManageCard.tsx  # 編集・削除・公開切替つきカード
│
├── features/                     # ========== 機能層 ==========
│   │                             # 画面固有のロジック。
│   │                             # Custom Hooks + Zustand ストア。
│   │                             # components にデータと関数を渡す仲介役。
│   │
│   ├── search/
│   │   ├── useSearch.ts          # 検索のデバウンス + クエリ管理
│   │   └── useVoiceInput.ts     # Web Speech API のラッパー
│   │
│   ├── content/
│   │   ├── useContentDetail.ts   # コンテンツ詳細データの取得・整形
│   │   └── useContentList.ts    # カテゴリ別一覧の取得・ページネーション
│   │
│   ├── chat/
│   │   ├── useChatSession.ts     # AI対話セッション管理
│   │   ├── useStreamResponse.ts # ストリーミング応答の処理
│   │   └── chatStore.ts         # Zustand: 対話状態（messages, phase, generatedContent）
│   │
│   ├── editor/
│   │   ├── useBlockEditor.ts    # ブロックのCRUD・並び替えロジック
│   │   ├── useAiAssist.ts       # ブロック単位のAI書き換え
│   │   ├── useImageUpload.ts    # 画像アップロード処理
│   │   └── editorStore.ts       # Zustand: 編集中のブロック状態
│   │
│   ├── location/
│   │   ├── useLocationManager.ts # 場所のCRUDロジック
│   │   └── useItemManager.ts    # アイテムのCRUDロジック
│   │
│   └── auth/
│       ├── useAuth.ts            # 認証状態の管理
│       └── authStore.ts          # Zustand: ユーザー・セッション
│
├── lib/                          # ========== ドメイン層 ==========
│   │                             # ビジネスロジック。フレームワーク非依存。
│   │                             # 型定義、バリデーション、定数、ユーティリティ。
│   │                             # React にも Next.js にも依存しない。
│   │
│   ├── types/                    # 型定義
│   │   ├── content.ts            # Content, ContentBlock, Category
│   │   ├── location.ts           # Location, Item
│   │   ├── store.ts              # Store
│   │   ├── chat.ts               # ChatMessage, DetectedItem, ChatPhase
│   │   └── api.ts                # APIリクエスト・レスポンスの型
│   │
│   ├── constants/
│   │   ├── categories.ts         # カテゴリ定義（slug, label, color, icon）
│   │   └── blockTypes.ts         # ブロックタイプ定義
│   │
│   ├── validators/
│   │   ├── contentValidator.ts   # コンテンツの入力バリデーション
│   │   └── locationValidator.ts  # 場所・アイテムのバリデーション
│   │
│   ├── sanitize/
│   │   └── htmlSanitizer.ts      # DOMPurify のホワイトリスト設定
│   │
│   ├── helpers/
│   │   ├── searchTextBuilder.ts  # CONTENT_BLOCK → search_text の生成
│   │   ├── blockSorter.ts        # ブロックの sort_order 再計算
│   │   └── dateFormatter.ts      # 日時フォーマット（「2h前」「1d前」）
│   │
│   └── prompts/
│       ├── createManualPrompt.ts # AI対話のシステムプロンプト生成
│       ├── editBlockPrompt.ts    # ブロックAI書き換えのプロンプト
│       └── searchPrompt.ts       # AI検索のプロンプト（Phase 2）
│
├── services/                     # ========== 通信層 ==========
│   │                             # 外部との通信のみ。
│   │                             # Supabase クライアント、Claude API、Storage。
│   │                             # ビジネスロジックを持たない。
│   │
│   ├── supabase/
│   │   ├── client.ts             # Supabase クライアント初期化（ブラウザ用）
│   │   ├── server.ts             # Supabase サーバークライアント（Server Component用）
│   │   ├── middleware.ts         # 認証ミドルウェア
│   │   ├── contentService.ts     # CONTENT テーブルの CRUD
│   │   ├── blockService.ts       # CONTENT_BLOCK テーブルの CRUD
│   │   ├── locationService.ts    # LOCATION テーブルの CRUD
│   │   ├── itemService.ts        # ITEM テーブルの CRUD
│   │   ├── searchService.ts      # 全文検索クエリ
│   │   └── storageService.ts     # Supabase Storage（画像アップロード）
│   │
│   └── claude/
│       ├── client.ts             # Claude API クライアント初期化
│       ├── chatService.ts        # AI対話のリクエスト・ストリーミング処理
│       └── assistService.ts      # ブロック書き換え等の単発リクエスト
│
├── middleware.ts                  # Next.js ミドルウェア（/owner 以下の認証チェック）
│
└── styles/
    └── globals.css               # Tailwind CSS のインポート + カスタムCSS変数
```

---

## 各層の責務と依存ルール

### UI層（`components/`）

- props でデータを受け取り、JSX を返す
- 内部の `useState` / `useRef` 等の純UIステートのみ許可
- `features/` の hooks を直接呼ばない（呼ぶのは `app/` の page.tsx）
- `services/` を直接呼ばない
- Tailwind CSS でスタイリング

### 機能層（`features/`）

- 画面固有のロジックをカスタム Hooks に集約
- Zustand ストアで画面横断の状態を管理
- `lib/` の型・バリデーション・ヘルパーを使用
- `services/` を呼んでデータ取得・更新
- React の hooks（useState, useEffect, useCallback）を使用

### ドメイン層（`lib/`）

- フレームワーク非依存の純粋関数・型定義
- React にも Next.js にも Supabase にも依存しない
- テスト容易（単体テストの中心）
- バリデーション、データ変換、プロンプト生成

### 通信層（`services/`）

- 外部サービスとの通信のみ
- Supabase クライアントの初期化と CRUD メソッド
- Claude API のリクエスト構築と送信
- レスポンスの型変換は最小限（ドメイン型への変換は `lib/` で）

---

## ファイル命名規則

| 種別 | 命名 | 例 |
|------|------|----|
| ページ | `page.tsx` | `app/m/[id]/page.tsx` |
| レイアウト | `layout.tsx` | `app/owner/layout.tsx` |
| コンポーネント | PascalCase | `ContentCard.tsx` |
| Hooks | camelCase, `use` prefix | `useSearch.ts` |
| Zustand ストア | camelCase, `Store` suffix | `chatStore.ts` |
| サービス | camelCase, `Service` suffix | `contentService.ts` |
| 型定義 | camelCase | `content.ts` |
| 定数 | camelCase | `categories.ts` |
| ユーティリティ | camelCase | `dateFormatter.ts` |

---

## データフローの具体例

### 例1: バイトがカテゴリ一覧を見る

```
app/c/[category]/page.tsx           ← Server Component
  └→ services/supabase/contentService.ts  ← DB問い合わせ
       └→ Supabase PostgreSQL              ← データ返却
  └→ components/content/ContentList.tsx    ← 描画
       └→ components/content/ContentCard.tsx
```

### 例2: 店長がAI対話でマニュアル作成

```
app/owner/create/page.tsx           ← Client Component
  └→ features/chat/useChatSession.ts     ← 対話ロジック
       └→ features/chat/chatStore.ts      ← Zustand 状態
       └→ lib/prompts/createManualPrompt.ts ← プロンプト組立
       └→ services/claude/chatService.ts  ← Claude API 呼出
  └→ components/chat/ChatContainer.tsx    ← 描画
       └→ components/chat/AiMessage.tsx
       └→ components/chat/UserMessage.tsx
       └→ components/chat/ItemSuggestionBadge.tsx
```

### 例3: 検索

```
app/search/page.tsx                 ← Server Component (URLクエリで再レンダリング)
  └→ services/supabase/searchService.ts  ← DB全文検索
  └→ services/supabase/itemService.ts    ← アイテム検索
  └→ components/search/SearchResults.tsx ← 描画

app/search/page.tsx 内の Client Component部分:
  └→ features/search/useSearch.ts        ← デバウンス + URL更新
  └→ components/search/SearchInput.tsx   ← 入力UI
```
