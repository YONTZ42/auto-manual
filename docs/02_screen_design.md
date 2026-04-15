# マニュアル作成管理・新人研修アプリ — 画面設計書

## 画面一覧

| # | ルート | 画面名 | モード | 優先度 |
|---|--------|--------|--------|--------|
| B1 | `/` | ホーム | バイト | P0 |
| B2 | `/search` | 検索 | バイト | P0 |
| B3 | `/c/[category]` | カテゴリ一覧 | バイト | P0 |
| B4 | `/m/[id]` | コンテンツ詳細 | バイト | P0 |
| B5 | `/locations` | 場所一覧 | バイト | P1 |
| B6 | `/locations/[id]` | 場所内アイテム | バイト | P1 |
| O1 | `/owner` | ダッシュボード | 店長 | P0 |
| O2 | `/owner/create` | AI対話作成 | 店長 | P0 |
| O3 | `/owner/edit/[id]` | ブロックエディタ | 店長 | P1 |
| O4 | `/owner/locations` | 配置管理 | 店長 | P1 |
| C1 | `/login` | ログイン | 共通 | P0 |

---

## B1. ホーム `/`

### レイアウト

```
┌─────────────────────────────────┐
│  🔍 何をお探しですか？      🎤  │  ← 検索バー（常時固定）
├─────────────────────────────────┤
│                                 │
│  ┌────┐ ┌────┐ ┌────┐          │
│  │レシピ│ │開店 │ │閉店 │          │  ← カテゴリグリッド 3列
│  └────┘ └────┘ └────┘          │
│  ┌────┐ ┌────┐ ┌────┐          │
│  │清掃 │ │接客 │ │場所 │          │
│  └────┘ └────┘ └────┘          │
│                                 │
│  最近追加                        │
│  ● 天ぷらの揚げ方    レシピ  2h前 │  ← 新着リスト
│  ● 開店チェックリスト  開店  1d前  │
│  ● トイレ清掃手順     清掃  3d前  │
│                                 │
└─────────────────────────────────┘
```

### コンポーネント構成

| コンポーネント | ファイル | 説明 |
|----------------|----------|------|
| SearchBar | `components/search/SearchBar.tsx` | 検索バー。タップで `/search` に遷移。右端にマイクボタン |
| CategoryGrid | `components/content/CategoryGrid.tsx` | 3列グリッド。各カテゴリは色+アイコンのカード |
| RecentList | `components/content/RecentList.tsx` | 新着コンテンツリスト。カテゴリ色ドット+タイトル+日時 |

### データ取得

- カテゴリ定義: 静的定数（`lib/constants/categories.ts`）
- 最近追加: Server Component で `CONTENT` を `updated_at DESC` で10件取得

### カテゴリ定義

| カテゴリ | slug | 色 | アイコン |
|----------|------|----|----------|
| レシピ | `recipe` | Coral (#D85A30) | 炎 |
| 開店 | `opening` | Teal (#0F6E56) | 時計 |
| 閉店 | `closing` | Purple (#534AB7) | ベル |
| 清掃 | `cleaning` | Blue (#185FA5) | ファイル |
| 接客 | `service` | Pink (#993556) | ユーザー |
| 場所 | `locations` | Amber (#854F0B) | モニター |

### インタラクション

- カテゴリカードタップ → `/c/[category]` に遷移
- 「場所」カードタップ → `/locations` に遷移
- 検索バータップ → `/search` に遷移（検索バーにフォーカス）
- マイクボタンタップ → Web Speech API 起動 → 認識結果を `/search?q=...` に遷移
- 新着リストのアイテムタップ → `/m/[id]` に遷移

---

## B2. 検索 `/search`

### レイアウト

```
┌─────────────────────────────────┐
│  ← 🔍 [入力中のテキスト]    🎤  │  ← 自動フォーカス
├─────────────────────────────────┤
│                                 │
│  検索候補（インクリメンタル）      │
│                                 │
│  ● 天ぷらの揚げ方               │
│    レシピ — 海老、ナス、天ぷら粉… │
│                                 │
│  ● 天ぷら粉の保管場所            │
│    場所 — 冷蔵庫1               │
│                                 │
│  ──────────────────             │
│                                 │
│  アイテムにもヒット               │
│  📦 天ぷら粉 → 冷蔵庫1          │
│                                 │
└─────────────────────────────────┘
```

### コンポーネント構成

| コンポーネント | ファイル | 説明 |
|----------------|----------|------|
| SearchInput | `components/search/SearchInput.tsx` | 自動フォーカスの入力欄。デバウンス300ms |
| SearchResults | `components/search/SearchResults.tsx` | CONTENT検索結果リスト |
| ItemSearchResults | `components/search/ItemSearchResults.tsx` | ITEM検索結果（場所情報つき） |

### データ取得

- URLクエリパラメータ `?q=` でサーバー側検索
- `CONTENT.search_text` に対する `ILIKE '%keyword%'` （MVP）
- `ITEM.name` に対する `ILIKE '%keyword%'` も同時実行
- Server Component で並列フェッチ

### インタラクション

- テキスト入力 → 300ms デバウンス → URL パラメータ更新 → Server Component 再レンダリング
- マイクボタンタップ → Web Speech API → 認識結果をクエリにセット
- コンテンツ結果タップ → `/m/[id]`
- アイテム結果タップ → `/locations/[location_id]`（場所のアイテム一覧）

---

## B3. カテゴリ一覧 `/c/[category]`

### レイアウト

```
┌─────────────────────────────────┐
│  ← レシピ                    🔍  │
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────┐    │
│  │ 天ぷらの揚げ方           │    │
│  │ 海老、ナス、天ぷら粉を…  │    │  ← コンテンツカード
│  │ 更新: 2h前               │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │ だし巻き卵                │    │
│  │ 卵、だし汁、砂糖を…      │    │
│  │ 更新: 1d前               │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │ 味噌汁の作り方            │    │
│  │ 味噌、豆腐、わかめを…    │    │
│  │ 更新: 3d前               │    │
│  └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

### コンポーネント構成

| コンポーネント | ファイル | 説明 |
|----------------|----------|------|
| ContentCard | `components/content/ContentCard.tsx` | タイトル+サマリー+更新日。カテゴリ色のアクセント |
| ContentList | `components/content/ContentList.tsx` | ContentCard の縦並びリスト |

### データ取得

- Server Component で `CONTENT` を `category` フィルタ + `updated_at DESC`
- ページネーションはカーソルベース（`updated_at` + `id`）

---

## B4. コンテンツ詳細 `/m/[id]`

### レイアウト

```
┌─────────────────────────────────┐
│  ← 天ぷらの揚げ方          レシピ │
├─────────────────────────────────┤
│                                 │
│  ┌─ 材料 ──────────────────┐    │
│  │ 🏷 天ぷら粉  冷蔵庫1     │    │  ← ITEM バッジ（場所つき）
│  │ 🏷 海老      冷蔵庫2     │    │
│  │ 🏷 ナス      冷蔵庫2     │    │
│  │ 🏷 揚げ油    棚3         │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─ 手順1 ─────────────────┐    │
│  │ 天ぷら粉と冷水を混ぜる    │    │  ← text ブロック
│  │ 混ぜすぎないこと          │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─⚠ 注意 ─────────────────┐   │
│  │ 油の温度は170-180℃を     │    │  ← caution ブロック（赤ボーダー）
│  │ 必ず温度計で確認する      │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─ 手順2 ─────────────────┐    │
│  │ 海老の尻尾を残して衣を    │    │
│  │ つけ、油に入れる          │    │
│  │ ┌──────────────────┐     │    │  ← image ブロック
│  │ │   [調理写真]      │     │    │
│  │ └──────────────────┘     │    │
│  └─────────────────────────┘    │
│                                 │
│  関連マニュアル                   │
│  → 揚げ油の処理方法              │
│  → 閉店時の厨房清掃              │
│                                 │
└─────────────────────────────────┘
```

### コンポーネント構成

| コンポーネント | ファイル | 説明 |
|----------------|----------|------|
| ContentHeader | `components/content/ContentHeader.tsx` | タイトル + カテゴリバッジ + 戻るボタン |
| BlockRenderer | `components/content/BlockRenderer.tsx` | block_type に応じた描画の分岐コンポーネント |
| TextBlock | `components/content/blocks/TextBlock.tsx` | body_html のレンダリング |
| ImageBlock | `components/content/blocks/ImageBlock.tsx` | 画像 + キャプション |
| VideoBlock | `components/content/blocks/VideoBlock.tsx` | 動画プレイヤー |
| CautionBlock | `components/content/blocks/CautionBlock.tsx` | 赤ボーダーの注意カード |
| EmbedBlock | `components/content/blocks/EmbedBlock.tsx` | SVG図解等の埋め込み |
| ItemBadge | `components/item/ItemBadge.tsx` | アイテム名 + 場所のバッジ |
| RelatedContents | `components/content/RelatedContents.tsx` | 関連コンテンツリンク |

### データ取得

- Server Component で `CONTENT` + `CONTENT_BLOCK`（sort_order順）+ `CONTENT_BLOCK_ITEM` + `ITEM` + `LOCATION` をJOIN
- 1クエリで全データ取得（N+1回避）

### ブロックレンダリングルール

```tsx
// BlockRenderer の分岐ロジック
switch (block.block_type) {
  case 'text':     return <TextBlock html={block.body_html} />
  case 'image':    return <ImageBlock url={block.media_url} caption={block.body_html} />
  case 'video':    return <VideoBlock url={block.media_url} />
  case 'caution':  return <CautionBlock text={block.caution} />
  case 'embed':    return <EmbedBlock html={block.body_html} />
}
```

### HTMLサニタイズルール（DOMPurify設定）

許可タグ:
```
p, h2, h3, h4, strong, em, u, s, br,
ul, ol, li, table, thead, tbody, tr, th, td,
div, span, img, video, source, svg, path, rect,
circle, line, text, g, defs, marker, a
```

許可属性:
```
class, style, src, alt, href, width, height,
viewBox, xmlns, d, fill, stroke, stroke-width,
rx, ry, cx, cy, r, x, y, x1, y1, x2, y2,
text-anchor, dominant-baseline, transform,
controls, autoplay, muted, loop
```

---

## B5. 場所一覧 `/locations`

### レイアウト

```
┌─────────────────────────────────┐
│  ← 場所から探す              🔍  │
├─────────────────────────────────┤
│                                 │
│  冷蔵・冷凍                      │
│  ┌──────────┐ ┌──────────┐     │
│  │ 冷蔵庫1   │ │ 冷蔵庫2   │     │  ← 2列グリッド
│  │ 12アイテム │ │ 8アイテム  │     │
│  └──────────┘ └──────────┘     │
│  ┌──────────┐                  │
│  │ 冷凍庫    │                  │
│  │ 5アイテム  │                  │
│  └──────────┘                  │
│                                 │
│  棚・収納                        │
│  ┌──────────┐ ┌──────────┐     │
│  │ 棚1       │ │ 棚2       │     │
│  │ 15アイテム │ │ 10アイテム │     │
│  └──────────┘ └──────────┘     │
│                                 │
│  調理スペース                     │
│  ┌──────────┐ ┌──────────┐     │
│  │ 調理台A   │ │ フライヤー │     │
│  │ 3アイテム  │ │ 2アイテム  │     │
│  └──────────┘ └──────────┘     │
│                                 │
└─────────────────────────────────┘
```

### コンポーネント構成

| コンポーネント | ファイル | 説明 |
|----------------|----------|------|
| LocationCard | `components/location/LocationCard.tsx` | 場所名 + アイテム数 |
| LocationGroup | `components/location/LocationGroup.tsx` | area_type ごとのグループ |

---

## B6. 場所内アイテム `/locations/[id]`

### レイアウト

```
┌─────────────────────────────────┐
│  ← 冷蔵庫1                      │
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────┐    │
│  │ [写真]  天ぷら粉          │    │  ← アイテムカード
│  │         関連: 天ぷらの揚げ方│   │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ [写真]  醤油              │    │
│  │         関連: 出汁の取り方 │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ [写真]  味噌              │    │
│  │         関連: 味噌汁の作り方│   │
│  └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

### コンポーネント構成

| コンポーネント | ファイル | 説明 |
|----------------|----------|------|
| ItemCard | `components/item/ItemCard.tsx` | 写真+名前+関連コンテンツリンク |

---

## O1. ダッシュボード `/owner`

### レイアウト

```
┌─────────────────────────────────┐
│  マニュアル管理            [ログアウト]│
├─────────────────────────────────┤
│                                 │
│  ┌──────┐ ┌──────┐ ┌──────┐   │
│  │  12   │ │   3  │ │   2  │   │  ← 統計カード
│  │ 全体  │ │ レシピ│ │ 開店 │   │
│  └──────┘ └──────┘ └──────┘   │
│                                 │
│  ┌─────────────────────────┐    │
│  │  ＋ AI で新規作成         │    │  ← CTAボタン（大きく目立つ）
│  └─────────────────────────┘    │
│                                 │
│  [全て▾] [レシピ] [開店] [閉店]   │  ← カテゴリフィルタ
│                                 │
│  ┌─────────────────────────┐    │
│  │ 天ぷらの揚げ方     [編集]  │    │
│  │ レシピ   公開中   2h前     │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ 開店チェックリスト  [編集]  │    │
│  │ 開店     公開中   1d前     │    │
│  └─────────────────────────┘    │
│                                 │
│  ─────────────────              │
│  📍 配置管理 →                   │  ← 配置管理への導線
│                                 │
└─────────────────────────────────┘
```

### コンポーネント構成

| コンポーネント | ファイル | 説明 |
|----------------|----------|------|
| StatCards | `components/owner/StatCards.tsx` | コンテンツ数の統計 |
| CreateButton | `components/owner/CreateButton.tsx` | AI新規作成CTA |
| CategoryFilter | `components/owner/CategoryFilter.tsx` | カテゴリフィルタのピル |
| ContentManageCard | `components/owner/ContentManageCard.tsx` | 編集・削除・公開切替つき |

---

## O2. AI対話作成 `/owner/create`

### レイアウト

```
┌─────────────────────────────────┐
│  ← 新規作成             [プレビュー]│
├─────────────────────────────────┤
│                                 │
│  🤖 何のマニュアルを作りますか？  │  ← AI メッセージ
│     レシピ、開店手順、接客マニュ   │
│     アルなど、自由にお伝えください  │
│                                 │
│                 天ぷらの揚げ方を  │  ← ユーザーメッセージ
│                    教えたい 👤   │
│                                 │
│  🤖 天ぷらですね。使う材料を     │
│     教えてください。              │
│     [天ぷら粉 - 冷蔵庫1]        │  ← 登録済みITEMバッジ（黄）
│     [揚げ油 - 棚3]              │
│     登録済みの材料を検出しました   │
│                                 │
│         そう、あと海老とナスも    │
│                      使う 👤    │
│                                 │
│  🤖 了解です。海老とナスは場所が  │
│     未登録です。どこに保管して     │
│     いますか？                   │
│     [海老 - 未登録]              │  ← 未登録ITEMバッジ（赤）
│     [ナス - 未登録]              │
│                                 │
├─────────────────────────────────┤
│  [メッセージを入力...]        🎤  │  ← 入力欄 + マイクボタン
└─────────────────────────────────┘
```

### コンポーネント構成

| コンポーネント | ファイル | 説明 |
|----------------|----------|------|
| ChatContainer | `components/chat/ChatContainer.tsx` | メッセージリストのスクロール管理 |
| AiMessage | `components/chat/AiMessage.tsx` | AIアバター + メッセージ + バッジ |
| UserMessage | `components/chat/UserMessage.tsx` | ユーザーメッセージ（右寄せ） |
| ItemSuggestionBadge | `components/chat/ItemSuggestionBadge.tsx` | ITEM自動検出バッジ（登録済み/未登録） |
| ChatInput | `components/chat/ChatInput.tsx` | テキスト入力 + 音声入力ボタン |
| PreviewPanel | `components/chat/PreviewPanel.tsx` | 生成中コンテンツのリアルタイムプレビュー |

### AI対話の状態管理（Zustand）

```typescript
interface CreateChatState {
  messages: ChatMessage[]
  generatedContent: {
    title: string
    category: string
    blocks: ContentBlock[]
    detectedItems: DetectedItem[]  // { name, locationId?, isNew }
  }
  phase: 'topic' | 'materials' | 'steps' | 'caution' | 'review'
  isStreaming: boolean
}
```

### Claude API プロンプト設計

System Prompt に以下を含める:
- 店舗の既存 ITEM リスト（名前 + 場所）
- 店舗の LOCATION リスト
- 既存カテゴリとコンテンツタイトル一覧（重複防止）
- 出力形式は構造化JSON（title, category, blocks配列）

---

## O3. ブロックエディタ `/owner/edit/[id]`

### レイアウト

```
┌─────────────────────────────────┐
│  ← 編集: 天ぷらの揚げ方   [保存]  │
├─────────────────────────────────┤
│                                 │
│  タイトル                        │
│  [天ぷらの揚げ方              ]   │
│                                 │
│  カテゴリ                        │
│  [レシピ ▾]                      │
│                                 │
│  ┌─ Block 1 (text) ──── ≡ ✕ ┐  │
│  │ 天ぷら粉と冷水を混ぜる     │  │  ← ドラッグハンドル + 削除
│  │ [AIで書き換え]              │  │
│  └─────────────────────────┘    │
│                                 │
│  ┌─ Block 2 (caution) ── ≡ ✕ ┐ │
│  │ ⚠ 油の温度は170-180℃     │  │
│  │ [AIで書き換え]              │  │
│  └─────────────────────────┘    │
│                                 │
│  ┌─ Block 3 (image) ─── ≡ ✕ ┐  │
│  │ [画像プレビュー]            │  │
│  │ [画像を変更]                │  │
│  └─────────────────────────┘    │
│                                 │
│  [＋ ブロック追加]                │
│  テキスト | 画像 | 注意 | 動画    │
│                                 │
└─────────────────────────────────┘
```

### コンポーネント構成

| コンポーネント | ファイル | 説明 |
|----------------|----------|------|
| BlockEditor | `components/editor/BlockEditor.tsx` | ブロック一覧 + 並び替え |
| EditableTextBlock | `components/editor/EditableTextBlock.tsx` | ContentEditable のテキストブロック |
| EditableCautionBlock | `components/editor/EditableCautionBlock.tsx` | 注意事項の編集 |
| EditableImageBlock | `components/editor/EditableImageBlock.tsx` | 画像アップロード + プレビュー |
| BlockToolbar | `components/editor/BlockToolbar.tsx` | ドラッグ・削除・AIアシストボタン |
| AddBlockMenu | `components/editor/AddBlockMenu.tsx` | ブロック種別選択メニュー |

---

## O4. 配置管理 `/owner/locations`

### レイアウト

```
┌─────────────────────────────────┐
│  ← 配置管理               [＋場所]│
├─────────────────────────────────┤
│                                 │
│  冷蔵庫1                    [編集]│
│  ┌──────────────────────────┐   │
│  │ 天ぷら粉 | 醤油 | 味噌    │   │  ← アイテムのチップ表示
│  │ だし汁   | 豆腐           │   │
│  │ [＋アイテム追加]           │   │
│  └──────────────────────────┘   │
│                                 │
│  冷蔵庫2                    [編集]│
│  ┌──────────────────────────┐   │
│  │ 海老 | ナス | にんじん     │   │
│  │ [＋アイテム追加]           │   │
│  └──────────────────────────┘   │
│                                 │
│  棚3                        [編集]│
│  ┌──────────────────────────┐   │
│  │ 揚げ油 | サラダ油 | ごま油 │   │
│  │ [＋アイテム追加]           │   │
│  └──────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

---

## 共通コンポーネント

| コンポーネント | ファイル | 用途 |
|----------------|----------|------|
| AppLayout | `components/layout/AppLayout.tsx` | バイトモード用レイアウト（ナビなし、軽量） |
| OwnerLayout | `components/layout/OwnerLayout.tsx` | 店長モード用レイアウト（サイドナビ or タブ） |
| BackButton | `components/ui/BackButton.tsx` | 戻るボタン |
| Badge | `components/ui/Badge.tsx` | 汎用バッジ（カテゴリ色、ステータス等） |
| Spinner | `components/ui/Spinner.tsx` | ローディング |
| EmptyState | `components/ui/EmptyState.tsx` | 空状態の表示 |
| VoiceButton | `components/ui/VoiceButton.tsx` | 音声入力ボタン（Web Speech API） |
