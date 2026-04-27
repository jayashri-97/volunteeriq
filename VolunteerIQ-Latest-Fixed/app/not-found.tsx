import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg1 flex items-center justify-center px-4">
      <div className="text-center">
        {/* Map pin SVG */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          className="w-16 h-16 text-text3 opacity-30 mx-auto mb-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
          />
        </svg>

        <h1 className="text-4xl font-bold text-text1 mb-2 font-mono">404</h1>
        <p className="text-[14px] text-text2 mb-1">Page not found</p>
        <p className="text-[11px] text-text3 mb-8 max-w-xs mx-auto">
          The resource you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-lg text-[11px] font-bold text-white bg-v-blue hover:bg-v-blue/90 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-lg text-[11px] font-bold text-text2 bg-bg3 border border-border2 hover:border-border3 hover:text-text1 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
