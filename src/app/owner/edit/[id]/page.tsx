import { BackButton } from '@/components/ui/BackButton';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPage({ params }: Props) {
  const { id } = await params;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <BackButton href="/owner" />
        <h1 className="font-semibold text-gray-900">編集</h1>
        <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
          保存
        </button>
      </div>
      <p className="text-sm text-gray-500">コンテンツID: {id}</p>
      <p className="text-sm text-gray-400 mt-4">ブロックエディタは Sprint 3 で実装予定です。</p>
    </div>
  );
}
