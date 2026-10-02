"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

function makeSlug(title: string) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base}-${Math.random().toString(36).slice(2, 6)}`;
}

const inputClass =
  "border border-neutral-800 bg-transparent p-3 text-sm outline-none focus:border-emerald-400";

export default function SubmitPage() {
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [type, setType] = useState("trend");
  const [title, setTitle] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [licensable, setLicensable] = useState(false);

  // type-specific fields
  const [authors, setAuthors] = useState("");
  const [year, setYear] = useState("");
  const [link, setLink] = useState("");
  const [repo, setRepo] = useState("");
  const [license, setLicense] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // only logged-in users can see this page
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/login");
      } else {
        setReady(true);
      }
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    let metadata: Record<string, string | number> = {};
    if (type === "paper") {
      metadata = { authors, year: Number(year), link };
    } else if (type === "tool") {
      metadata = { repo, license };
    } else if (type === "project") {
      metadata = { repo, link };
    }

    const slug = makeSlug(title);

    const { error } = await supabase.from("posts").insert({
      type,
      title,
      slug,
      summary,
      body,
      author_name: authorName,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      metadata,
      licensable: type === "paper" ? false : licensable,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // new posts start as "pending", so show a message instead of opening the post
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 p-6">
        <h1 className="mb-4 text-2xl font-bold uppercase tracking-widest">
          Submitted
        </h1>
        <p className="text-sm text-neutral-400">
          Thanks! Your post is in review and will appear on Signal once it is
          approved.
        </p>
      </main>
    );
  }

  if (!ready) return null;

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 p-6">
      <h1 className="mb-6 text-2xl font-bold uppercase tracking-widest">
        Submit a post
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border border-neutral-800 bg-neutral-950 p-3 text-sm text-neutral-100 outline-none focus:border-emerald-400"
        >
          <option value="trend" className="bg-neutral-950 text-neutral-100">Trend</option>
          <option value="tool" className="bg-neutral-950 text-neutral-100">Tool</option>
          <option value="paper" className="bg-neutral-950 text-neutral-100">Research paper</option>
          <option value="project" className="bg-neutral-950 text-neutral-100">Project</option>
        </select>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={inputClass}
        />

        <input
          placeholder="Author name (shown on the post)"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          required
          className={inputClass}
        />

        <input
          placeholder="One-line summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
          className={inputClass}
        />

        {type === "paper" && (
          <>
            <input
              placeholder="Paper authors (e.g. Smith et al.)"
              value={authors}
              onChange={(e) => setAuthors(e.target.value)}
              required
              className={inputClass}
            />
            <input
              type="number"
              placeholder="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
              className={inputClass}
            />
            <input
              type="url"
              placeholder="Link to the original paper (arXiv / DOI)"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
              className={inputClass}
            />
          </>
        )}

        {type === "tool" && (
          <>
            <input
              type="url"
              placeholder="Repository URL"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              className={inputClass}
            />
            <input
              placeholder="License (e.g. MIT)"
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              className={inputClass}
            />
          </>
        )}

        {type === "project" && (
          <>
            <input
              type="url"
              placeholder="Repository URL"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              className={inputClass}
            />
            <input
              type="url"
              placeholder="Demo link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className={inputClass}
            />
          </>
        )}

        <textarea
          placeholder={
            type === "paper"
              ? "Your plain-language summary and commentary"
              : "Write your post here"
          }
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={10}
          className={inputClass}
        />

        <input
          placeholder="Tags, separated by commas (e.g. llm, appsec)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className={inputClass}
        />

        {type !== "paper" && (
          <label className="flex items-center gap-2 text-sm text-neutral-400">
            <input
              type="checkbox"
              checked={licensable}
              onChange={(e) => setLicensable(e.target.checked)}
            />
            Open to licensing requests
          </label>
        )}

        <button
          type="submit"
          disabled={loading}
          className="border border-emerald-400 p-3 text-sm uppercase tracking-widest text-emerald-400 transition-colors hover:bg-emerald-400 hover:text-black disabled:opacity-50"
        >
          {loading ? "Publishing..." : "Publish"}
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
    </main>
  );
}