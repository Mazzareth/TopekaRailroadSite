"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase/client";
import { exchangeIdTokenForSession } from "@/lib/clientAuth";
import { GoogleButton } from "@/components/GoogleButton";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginFallback() {
  return (
    <main className="auth-shell">
      <div className="auth-card">
        <div className="eyebrow">Station Master</div>
        <h1>Sign in</h1>
        <p className="lede">Loading…</p>
      </div>
    </main>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);
      await exchangeIdTokenForSession(cred.user);
      router.replace(next);
      router.refresh();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <div className="eyebrow">Station Master</div>
        <h1>Sign in</h1>
        <p className="lede">For editors, officers, and members.</p>

        {err && <div className="err">{err}</div>}

        <GoogleButton next={next} onError={setErr} />
        <div className="auth-divider"><span>or</span></div>

        <form onSubmit={onSubmit}>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="actions">
            <button type="submit" className="btn" disabled={busy}>
              {busy ? "Signing in…" : "Sign In"}
            </button>
            <Link href="/" style={{ marginLeft: "auto" }}>← Back to site</Link>
          </div>
        </form>

        <div className="foot-link">
          New to the club? <Link href="/signup">Become a member →</Link>
        </div>
      </div>
    </main>
  );
}
