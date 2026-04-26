'use client';

import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface InputStripProps {
  onParse: (text: string) => void;
  isParsing: boolean;
}

const MIN_LENGTH = 20;
const MAX_LENGTH = 5000;

export default function InputStrip({ onParse, isParsing }: InputStripProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const validate = (val: string): string => {
    if (!val.trim()) return 'Please paste or type a field report first.';
    if (val.trim().length < MIN_LENGTH) return 'Report is too short. Add more detail about the need.';
    if (val.length > MAX_LENGTH) return `Report exceeds ${MAX_LENGTH.toLocaleString()} characters. Please shorten it.`;
    return '';
  };

  const handleSubmit = useCallback(() => {
    const err = validate(text);
    if (err) { setError(err); return; }
    setError('');
    onParse(text);
    setText('');
  }, [text, onParse]);

  const handleFileRead = useCallback((file: File) => {
    const allowed = ['text/plain', 'text/csv', 'application/pdf', 'text/markdown'];
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (file.type === 'application/pdf' || ext === 'pdf') {
      // For PDF we simulate extraction
      setText(prev => prev + `\n[PDF uploaded: ${file.name} — content will be extracted by AI parser]`);
      return;
    }

    if (!allowed.includes(file.type) && !['txt', 'csv', 'md'].includes(ext || '')) {
      setError('Unsupported file type. Use .txt, .csv, .pdf, or .md files.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setText(prev => {
        const combined = prev ? prev + '\n---\n' + content : content;
        return combined.slice(0, MAX_LENGTH);
      });
      setError('');
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach(handleFileRead);
  }, [handleFileRead]);

  const charCount = text.length;
  const charColor = charCount > MAX_LENGTH ? 'var(--red)' : charCount > MAX_LENGTH * 0.8 ? 'var(--orange)' : 'var(--text2)';

  return (
    <div className="border-t border-border1 bg-bg2 p-2.5">
      {/* Textarea with drag & drop */}
      <div
        className={cn(
          'relative rounded-lg border transition-all duration-200',
          dragOver ? 'border-v-blue bg-v-blue/5' : 'border-border1',
          error ? 'border-red-500/50' : ''
        )}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => { setText(e.target.value); if (error) setError(''); }}
          onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit(); }}
          placeholder="Paste in field report — WhatsApp messages, emails, paper notes, typed text, or any format..."
          className="w-full h-24 px-3 py-2 bg-transparent text-[13px] text-text1 placeholder:text-text2 resize-none outline-none"
          disabled={isParsing}
          maxLength={MAX_LENGTH + 100}
          aria-label="Field report input"
        />

        {/* Drag overlay */}
        {dragOver && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-v-blue/10 border-2 border-dashed border-v-blue pointer-events-none">
            <span className="text-[11px] font-semibold text-v-blue">Drop file here — .txt, .csv, .pdf</span>
          </div>
        )}
      </div>

      {/* Bottom bar: error, char count, buttons */}
      <div className="flex items-center justify-between mt-1.5 gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {error ? (
            <span className="text-[10px] text-red-500 font-medium truncate">{error}</span>
          ) : (
            <span className="text-[9px] font-mono" style={{ color: charColor }}>
              {charCount > 0 ? `${charCount.toLocaleString()} / ${MAX_LENGTH.toLocaleString()}` : ''}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* File upload button */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.csv,.pdf,.md"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileRead(file);
              e.target.value = '';
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isParsing}
            className="h-9 px-4 rounded-md text-[13px] font-bold text-text2 bg-bg3 border border-border2 hover:border-border3 hover:text-text1 transition-colors disabled:opacity-40"
            title="Upload report file (.txt, .csv, .pdf)"
          >
            <span className="flex items-center gap-1">
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                <path d="M7 8.5V12h2V8.5l2.146 2.146 1.414-1.414L8 4.672 3.44 9.232l1.414 1.414L7 8.5z"/>
                <path d="M3 14h10v-2H3v2z"/>
              </svg>
              Upload
            </span>
          </button>

          {/* Parse button */}
          <button
            onClick={handleSubmit}
            disabled={isParsing || !text.trim()}
            className={cn(
              'h-9 px-6 rounded-md text-[13px] font-bold transition-all duration-200',
              isParsing
                ? 'bg-bg3 text-text3 cursor-wait'
                : text.trim()
                ? 'bg-v-blue text-white hover:bg-v-blue/90 shadow-sm'
                : 'bg-bg4 text-text2 cursor-not-allowed border border-border2'
            )}
          >
            {isParsing ? (
              <span className="flex items-center gap-1.5">
                <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4 31.4" strokeLinecap="round" />
                </svg>
                Parsing…
              </span>
            ) : (
              'Parse Report'
            )}
          </button>
        </div>
      </div>

      {/* Shortcut hint */}
      <div className="mt-1.5 text-[12px] text-text3 font-bold text-right tracking-tight">
        Ctrl+Enter to parse · Drag & drop .txt/.csv/.pdf
      </div>
    </div>
  );
}
