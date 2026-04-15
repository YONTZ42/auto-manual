interface CautionBlockProps {
  text: string;
}

export function CautionBlock({ text }: CautionBlockProps) {
  return (
    <div className="mx-4 my-2 border-l-4 border-red-500 bg-red-50 rounded-r-xl p-4">
      <p className="text-sm font-semibold text-red-700 mb-1">⚠ 注意</p>
      <p className="text-sm text-red-600">{text}</p>
    </div>
  );
}
