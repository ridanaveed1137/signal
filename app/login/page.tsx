"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="mx-auto w-full max-w-sm flex-1 p-6">
      <h1 className="mb-6 text-2xl font-bold uppercase tracking-widest">
        {mode === "login" ? "Log in" : "Sign up"}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-neutral-800 bg-transparent p-3 text-sm outline-none focus:border-emerald-400"
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="border border-neutral-800 bg-transparent p-3 text-sm outline-none focus:border-emerald-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="border border-emerald-400 p-3 text-sm uppercase tracking-widest text-emerald-400 transition-colors hover:bg-emerald-400 hover:text-black disabled:opacity-50"
        >
          {loading ? "..." : mode === "login" ? "Log in" : "Create account"}
        </button>
      </form>

      {message && <p className="mt-4 text-sm text-red-400">{message}</p>}

      <button
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
        className="mt-6 text-sm text-neutral-500 hover:text-neutral-300"
      >
        {mode === "login"
          ? "No account? Sign up"
          : "Already have an account? Log in"}
      </button>
    </main>
  );
}