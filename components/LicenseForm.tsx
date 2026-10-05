"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const inputClass =
  "border border-ln bg-transparent p-3 text-sm outline-none focus:border-ac";

export default function LicenseForm({ postId }: { postId: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.from("license_requests").insert({
      post_id: postId,
      requester_name: name,
      requester_email: email,
      message,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <p className="mt-10 border border-ac p-4 text-sm text-ac">
        Request sent. The author will get back to you by email.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-10 border border-ac px-4 py-3 text-sm uppercase tracking-widest text-ac transition-colors hover:bg-ac hover:text-black"
      >
        Contact author to license
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 flex flex-col gap-4 border border-ln p-6"
    >
      <h2 className="text-sm uppercase tracking-widest text-ac">
        License request
      </h2>

      <input
        placeholder="Your name or company"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className={inputClass}
      />
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={inputClass}
      />
      <textarea
        placeholder="What do you want to use this for? (product, internal use, scope)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        rows={5}
        className={inputClass}
      />

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="border border-ac px-4 py-3 text-sm uppercase tracking-widest text-ac transition-colors hover:bg-ac hover:text-black disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send request"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-mu hover:text-tx"
        >
          Cancel
        </button>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
    </form>
  );
}