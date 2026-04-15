import { BackButton } from '@/components/ui/BackButton';

export default function OwnerLocationsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <BackButton href="/owner" />
        <h1 className="font-semibold text-gray-900">配置管理</h1>
        <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
          ＋場所
        </button>
      </div>
      <p className="text-sm text-gray-400">配置管理機能は Sprint 3 で実装予定です。</p>
    </div>
  );
}
