interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-lg mx-auto bg-white min-h-screen">{children}</main>
    </div>
  );
}
