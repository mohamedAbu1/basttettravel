"use client";

import { signIn } from "next-auth/react";

export default function OAuthButtons() {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="btn btn-google"
      >
        الدخول عبر Google
      </button>
    </div>
  );
}
