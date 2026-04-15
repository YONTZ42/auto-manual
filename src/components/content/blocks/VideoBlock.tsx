interface VideoBlockProps {
  url: string;
}

export function VideoBlock({ url }: VideoBlockProps) {
  return (
    <div className="px-4 py-2">
      <video
        src={url}
        controls
        className="w-full rounded-xl"
        playsInline
      />
    </div>
  );
}
