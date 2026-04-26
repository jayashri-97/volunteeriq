'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-bg1 flex items-center justify-center px-4">
      <div className="text-center">
        {/* Warning triangle */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          className="w-16 h-16 mx-auto mb-6"
          style={{ color: 'var(--orange)' }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>

        <h1 className="text-3xl font-bold text-text1 mb-2">Something went wrong</h1>
        <p className="text-[12px] text-text3 mb-2">An unexpected error occurred.</p>
        {error.digest && (
          <p className="text-[10px] font-mono text-text4 mb-8">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-lg text-[11px] font-bold text-white bg-v-blue hover:bg-v-blue/90 transition-colors"
          >
            Try Again
          </button>
          <a
            href="mailto:support@volunteeriq.org"
            className="px-5 py-2.5 rounded-lg text-[11px] font-bold text-text2 bg-bg3 border border-border2 hover:border-border3 hover:text-text1 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
