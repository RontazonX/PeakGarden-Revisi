'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <h2 className="text-4xl font-bold text-slate-900 mb-4">Something went wrong!</h2>
      <p className="text-slate-600 mb-8">{error.message || 'An unexpected error occurred'}</p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
        >
          Try again
        </button>
        <Link 
          href="/"
          className="px-6 py-3 bg-white text-emerald-600 border border-emerald-600 rounded-xl hover:bg-emerald-50 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
