"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { TOPICS } from "@/lib/topics";

function makeSlug(title: string) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base}-${Math.random().toString(36).slice(2, 6)}`;
}

const inputClass =
  "border border-ln bg-transparent p-3 text-sm outline-none focus:border-ac";
const selectClass =
  "border border-ln bg-bg p-3 text-sm text-tx outline-none focus:border-ac";
const optClass = "bg-bg text-tx";

export default function SubmitPage() {
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [type, setType] = useState("trend");
  const [topic, setTopic] = useState("");
  const [curated, setCurated] = useState(false);
  const [sourceUrl, setSourceUrl] = useState("");
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
      topic: topic || null,
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
      curated,
      source_url: curated ? sourceUrl : null,
      licensable: type === "paper" || curated ? false : licensable,
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
        <p className="text-sm text-mu">
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
          className={selectClass}
        >
          <option value="trend" className={optClass}>Trend</option>
          <option value="tool" className={optClass}>Tool</option>
          <option value="paper" className={optClass}>Research paper</option>
          <option value="project" className={optClass}>Project</option>
        </select>

        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className={selectClass}
        >
          <option value="" className={optClass}>Topic (optional)</option>
          {TOPICS.map((t) => (
            <option key={t.slug} value={t.slug} className={optClass}>
              {t.title}
            </option>
          ))}
        </select>

        <label className="flex items-start gap-2 text-sm text-mu">
          <input
            type="checkbox"
            checked={curated}
            onChange={(e) => setCurated(e.target.checked)}
            className="mt-1"
          />
          <span>
            Curated from another source. I am summarizing someone else&apos;s
            work in my own words and linking to the original.
          </span>
        </label>

        {curated && (
          <input
            type="url"
            placeholder="Link to the original source (https://...)"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            required
            pattern="https://.*"
            className={inputClass}
          />
        )}

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={inputClass}
        />

        <input
          placeholder={
            curated ? "Curated by (your name)" : "Author name (shown on the post)"
          }
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
            curated
              ? "In your own words: what it is and why it matters. Do not paste the original text."
              : type === "paper"
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

        {type !== "paper" && !curated && (
          <label className="flex items-center gap-2 text-sm text-mu">
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
          className="border border-ac p-3 text-sm uppercase tracking-widest text-ac transition-colors hover:bg-ac hover:text-black disabled:opacity-50"
        >
          {loading ? "Publishing..." : "Publish"}
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
    </main>
  );
}