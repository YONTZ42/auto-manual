import Link from 'next/link';

export function CreateButton() {
  return (
    <Link
      href="/owner/create"
      className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors mb-6"
    >
      <span className="text-xl">＋</span>
      <span>AI で新規作成</span>
    </Link>
  );
}
