'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Something went wrong!</h2>
          <p className="text-slate-600 mb-8">{error.message || 'A critical error occurred'}</p>
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
