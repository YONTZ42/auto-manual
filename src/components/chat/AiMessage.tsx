interface AiMessageProps {
  content: string;
  children?: React.ReactNode;
}

export function AiMessage({ content, children }: AiMessageProps) {
  return (
    <div className="flex gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-white text-sm">
        🤖
      </div>
      <div className="flex-1">
        <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-gray-800">
          {content}
        </div>
        {children && <div className="mt-2">{children}</div>}
      </div>
    </div>
  );
}
