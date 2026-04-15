'use client';

import type { ContentBlock } from '@/lib/types/content';
import { BlockRenderer } from '@/components/content/BlockRenderer';

interface BlockEditorProps {
  blocks: ContentBlock[];
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDelete: (index: number) => void;
}

export function BlockEditor({ blocks, onMoveUp, onMoveDown, onDelete }: BlockEditorProps) {
  return (
    <div className="space-y-3">
      {blocks.map((block, i) => (
        <div key={block.id} className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
            <span className="text-xs text-gray-500">Block {i + 1} ({block.block_type})</span>
            <div className="flex gap-1">
              <button onClick={() => onMoveUp(i)} disabled={i === 0} className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30">↑</button>
              <button onClick={() => onMoveDown(i)} disabled={i === blocks.length - 1} className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30">↓</button>
              <button onClick={() => onDelete(i)} className="p-1 text-red-400 hover:text-red-600">✕</button>
            </div>
          </div>
          <BlockRenderer block={block} />
        </div>
      ))}
    </div>
  );
}
