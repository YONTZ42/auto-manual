import type { ContentBlock } from '@/lib/types/content';
import { TextBlock } from './blocks/TextBlock';
import { ImageBlock } from './blocks/ImageBlock';
import { VideoBlock } from './blocks/VideoBlock';
import { CautionBlock } from './blocks/CautionBlock';
import { EmbedBlock } from './blocks/EmbedBlock';

interface BlockRendererProps {
  block: ContentBlock;
}

export function BlockRenderer({ block }: BlockRendererProps) {
  switch (block.block_type) {
    case 'text':
      return <TextBlock html={block.body_html ?? ''} />;
    case 'image':
      return block.media_url ? (
        <ImageBlock url={block.media_url} caption={block.body_html} />
      ) : null;
    case 'video':
      return block.media_url ? <VideoBlock url={block.media_url} /> : null;
    case 'caution':
      return <CautionBlock text={block.caution ?? ''} />;
    case 'embed':
      return <EmbedBlock html={block.body_html ?? ''} />;
    default:
      return null;
  }
}
