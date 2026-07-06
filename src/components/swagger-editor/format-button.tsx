'use client';

interface FormatButtonProps {
  type: 'json' | 'yaml';
  currentFormat: 'json' | 'yaml';
  onClick: (format: 'json' | 'yaml') => void;
}

export function FormatButton({ type, currentFormat, onClick }: FormatButtonProps) {
  const isActive = currentFormat === type;

  return (
    <button
      onClick={() => onClick(type)}
      className={`rounded px-2.5 py-1 font-mono text-[11px] font-semibold transition-colors ${
        isActive ? 'bg-swagger-green text-swagger-dark' : 'text-gray-400 hover:text-white'
      }`}
    >
      {type.toUpperCase()}
    </button>
  );
}
