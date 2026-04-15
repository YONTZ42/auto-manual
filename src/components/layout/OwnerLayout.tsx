import Link from 'next/link';

interface OwnerLayoutProps {
  children: React.ReactNode;
}

export function OwnerLayout({ children }: OwnerLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <Link href="/owner" className="font-bold text-gray-900">
          マニュアル管理
        </Link>
        <div className="flex gap-4 text-sm">
          <Link href="/owner" className="text-gray-600 hover:text-gray-900">
            ダッシュボード
          </Link>
          <Link href="/owner/locations" className="text-gray-600 hover:text-gray-900">
            配置管理
          </Link>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
