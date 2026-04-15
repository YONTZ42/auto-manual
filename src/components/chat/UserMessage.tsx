interface UserMessageProps {
  content: string;
}

export function UserMessage({ content }: UserMessageProps) {
  return (
    <div className="flex justify-end mb-4">
      <div className="max-w-[75%] bg-blue-600 text-white rounded-2xl rounded-tr-none px-4 py-3 text-sm">
        {content}
      </div>
    </div>
  );
}
