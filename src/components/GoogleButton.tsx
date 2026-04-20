"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle } from "@/lib/clientAuth";

export function GoogleButton({
  next = "/admin",
  label = "Continue with Google",
  onError,
}: {
  next?: string;
  label?: string;
  onError?: (message: string) => void;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onClick() {
    setBusy(true);
    try {
      await signInWithGoogle();
      router.replace(next);
      router.refresh();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Google sign-in failed";
      // Common popup-close errors — friendlier copy.
      if (/popup-closed/i.test(msg) || /cancelled/i.test(msg)) {
        onError?.("Sign-in was cancelled.");
      } else {
        onError?.(msg);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <button type="button" className="google-btn" onClick={onClick} disabled={busy}>
      <GoogleGlyph />
      {busy ? "Signing in…" : label}
    </button>
  );
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M9 3.48c1.69 0 2.84.73 3.49 1.34l2.55-2.49C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.97 2.3C4.65 5.1 6.62 3.48 9 3.48z"
      />
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.63-.06-1.25-.17-1.84H9v3.49h4.84c-.21 1.13-.84 2.08-1.79 2.72l2.88 2.23c1.69-1.55 2.71-3.84 2.71-6.6z"
      />
      <path
        fill="#FBBC05"
        d="M3.93 10.74A5.45 5.45 0 013.63 9c0-.6.1-1.19.28-1.74L.96 4.96A9 9 0 000 9c0 1.45.35 2.83.96 4.04l2.97-2.3z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.88-2.23c-.8.54-1.85.85-3.08.85-2.38 0-4.35-1.62-5.07-3.79L.96 13.04C2.44 15.98 5.48 18 9 18z"
      />
    </svg>
  );
}
