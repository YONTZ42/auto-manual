interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: string;
}

export function EmptyState({ title, description, icon = '📭' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
      <span className="text-4xl mb-3">{icon}</span>
      <p className="font-medium text-gray-700">{title}</p>
      {description && <p className="text-sm mt-1">{description}</p>}
    </div>
  );
}
