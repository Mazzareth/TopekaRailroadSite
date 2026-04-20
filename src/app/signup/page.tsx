"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase/client";
import { exchangeIdTokenForSession } from "@/lib/clientAuth";
import { GoogleButton } from "@/components/GoogleButton";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const r = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, displayName: name }),
      });
      if (!r.ok) {
        const { error } = await r.json().catch(() => ({ error: "Signup failed" }));
        throw new Error(error);
      }
      // Auto sign-in after create
      const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);
      await exchangeIdTokenForSession(cred.user);
      router.replace("/");
      router.refresh();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Signup failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <div className="eyebrow">All Aboard</div>
        <h1>Become a Member</h1>
        <p className="lede">Create an account — dues handled separately at the clubhouse.</p>

        {err && <div className="err">{err}</div>}

        <GoogleButton next="/" label="Sign up with Google" onError={setErr} />
        <div className="auth-divider"><span>or</span></div>

        <form onSubmit={onSubmit}>
          <div className="field">
            <label>Name</label>
            <input type="text" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div style={{ fontSize: 13, color: "var(--ink-soft)", fontStyle: "italic", marginTop: 4 }}>
              At least 8 characters.
            </div>
          </div>
          <div className="actions">
            <button type="submit" className="btn brass" disabled={busy}>
              {busy ? "Creating…" : "Create Account"}
            </button>
            <Link href="/" style={{ marginLeft: "auto" }}>← Back to site</Link>
          </div>
        </form>

        <div className="foot-link">
          Already a member? <Link href="/login">Sign in →</Link>
        </div>
      </div>
    </main>
  );
}
