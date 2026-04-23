"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function NotFoundContent() {
  const params = useSearchParams();
  const query = params.get("q");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-4xl font-bold text-red-600 mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-700 mb-6">
        Sorry, we couldn’t find the page you’re looking for.
      </p>

      {query && (
        <p className="text-sm text-gray-500">
          You searched for: <strong>{query}</strong>
        </p>
      )}

      <a
        href="/"
        className="mt-6 px-4 py-2 rounded-lg font-bold transition text-white bg-[#c9a34a] hover:bg-[#b5892e]"
      >
        Back to Home
      </a>
    </div>
  );
}

export default function NotFoundPage() {
  return (
    <Suspense fallback={<div className="text-center p-6">Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  );
}
