import type { Item } from '@/lib/types/location';
import type { Location } from '@/lib/types/location';
import type { Content } from '@/lib/types/content';

export function buildCreateManualSystemPrompt(
  items: Item[],
  locations: Location[],
  existingContents: Content[]
): string {
  const itemList = items
    .map((i) => `- ${i.name}（${i.location?.label ?? '場所未登録'}）`)
    .join('\n');

  const locationList = locations.map((l) => `- ${l.label}`).join('\n');

  const contentTitles = existingContents
    .map((c) => `- [${c.category}] ${c.title}`)
    .join('\n');

  return `あなたは飲食店のマニュアル作成AIアシスタントです。
店長との対話を通じて、わかりやすいマニュアルを作成します。

## 店舗の登録済みアイテム
${itemList || '（未登録）'}

## 保管場所一覧
${locationList || '（未登録）'}

## 既存のコンテンツ（重複防止）
${contentTitles || '（なし）'}

## 対話の進め方
1. 「何のマニュアルですか？」でカテゴリを自動判定
2. 「材料・道具は？」で登録済みアイテムをサジェスト
3. 「手順を教えてください」で手順を構造化
4. 「注意事項は？」でcautionブロックに格納
5. プレビュー確認 → DB保存

## 出力形式
最終確認時は以下のJSON形式で出力してください：
\`\`\`json
{
  "title": "マニュアルタイトル",
  "category": "recipe|opening|closing|cleaning|service|other",
  "blocks": [
    { "sort_order": 0, "block_type": "text", "body_html": "<p>内容</p>", "media_url": null, "caution": null },
    { "sort_order": 1, "block_type": "caution", "body_html": null, "media_url": null, "caution": "注意事項" }
  ],
  "detectedItems": [
    { "name": "アイテム名", "isNew": false, "locationLabel": "保管場所" }
  ]
}
\`\`\`

未登録のアイテムを検出した場合は、どこに保管しているか確認してください。`;
}
