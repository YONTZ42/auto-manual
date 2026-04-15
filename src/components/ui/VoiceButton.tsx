'use client';

interface VoiceButtonProps {
  onResult: (text: string) => void;
  isListening?: boolean;
}

export function VoiceButton({ onResult, isListening = false }: VoiceButtonProps) {
  const handleClick = () => {
    if (typeof window === 'undefined') return;
    type SpeechRecognitionCtor = new () => {
      lang: string;
      start: () => void;
      onresult: ((event: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => void) | null;
    };
    const SpeechRecognitionAPI =
      (window as unknown as { SpeechRecognition?: SpeechRecognitionCtor }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: SpeechRecognitionCtor }).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      alert('お使いのブラウザは音声入力に対応していません');
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = 'ja-JP';
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      onResult(text);
    };
    recognition.start();
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full transition-colors ${
        isListening ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
      title="音声入力"
    >
      🎤
    </button>
  );
}
