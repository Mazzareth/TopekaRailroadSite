"use client";

import {
  GoogleAuthProvider,
  signInWithPopup,
  type User,
} from "firebase/auth";
import { firebaseAuth } from "./firebase/client";

export async function exchangeIdTokenForSession(user: User): Promise<void> {
  const idToken = await user.getIdToken(true);
  const res = await fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: "Sign-in failed" }));
    throw new Error(error || "Sign-in failed");
  }
}

export async function signInWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const cred = await signInWithPopup(firebaseAuth, provider);
  await exchangeIdTokenForSession(cred.user);
  return cred.user;
}
