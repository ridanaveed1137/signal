"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Post = {
  id: string;
  type: string;
  title: string;
  slug: string;
  summary: string | null;
  author_name: string;
  status: "pending" | "published" | "rejected";
  featured: boolean;
  created_at: string;
};

type LicenseRequest = {
  id: string;
  requester_name: string;
  requester_email: string;
  message: string;
  status: string;
  created_at: string;
  posts: { title: string } | null;
};

const btn =
  "border border-neutral-700 px-3 py-1 text-xs uppercase tracking-widest transition-colors hover:border-emerald-400 hover:text-emerald-400";

export default function AdminPage() {
  const router = useRouter();
  const [state, setState] = useState<"loading" | "denied" | "ok">("loading");
  const [posts, setPosts] = useState<Post[]>([]);
  const [requests, setRequests] = useState<LicenseRequest[]>([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const { data: postData } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: reqData } = await supabase
      .from("license_requests")
      .select("*, posts(title)")
      .order("created_at", { ascending: false });

    setPosts((postData as Post[]) ?? []);
    setRequests((reqData as unknown as LicenseRequest[]) ?? []);
  }, []);

  useEffect(() => {
    async function init() {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        router.push("/login");
        return;
      }

      const { data: isAdmin } = await supabase.rpc("is_admin");
      if (!isAdmin) {
        setState("denied");
        return;
      }

      await load();
      setState("ok");
    }
    init();
  }, [router, load]);

  async function setStatus(id: string, status: Post["status"]) {
    setError("");
    const { error } = await supabase.from("posts").update({ status }).eq("id", id);
    if (error) setError(error.message);
    await load();
  }

  async function toggleFeatured(post: Post) {
    setError("");
    const { error } = await supabase
      .from("posts")
      .update({ featured: !post.featured })
      .eq("id", post.id);
    if (error) setError(error.message);
    await load();
  }

  async function deletePost(id: string) {
    if (!confirm("Delete this post permanently?")) return;
    setError("");
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) setError(error.message);
    await load();
  }

  if (state === "loading") return null;

  if (state === "denied") {
    return (
      <main className="flex-1 p-6">
        <p className="text-sm text-neutral-400">You do not have access to this page.</p>
      </main>
    );
  }

  const pending = posts.filter((p) => p.status === "pending");
  const published = posts.filter((p) => p.status === "published");
  const rejected = posts.filter((p) => p.status === "rejected");

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 p-6">
      <h1 className="mb-8 text-3xl font-bold uppercase tracking-widest">Admin</h1>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      <Section title={`Pending review (${pending.length})`}>
        {pending.length === 0 && <Empty text="Nothing waiting for review." />}
        {pending.map((p) => (
          <Row key={p.id} post={p}>
            <button className={btn} onClick={() => setStatus(p.id, "published")}>
              Approve
            </button>
            <button className={btn} onClick={() => setStatus(p.id, "rejected")}>
              Reject
            </button>
          </Row>
        ))}
      </Section>

      <Section title={`Published (${published.length})`}>
        {published.map((p) => (
          <Row key={p.id} post={p}>
            <button className={btn} onClick={() => toggleFeatured(p)}>
              {p.featured ? "Unfeature" : "Feature"}
            </button>
            <button className={btn} onClick={() => setStatus(p.id, "pending")}>
              Unpublish
            </button>
            <button className={btn} onClick={() => deletePost(p.id)}>
              Delete
            </button>
          </Row>
        ))}
      </Section>

      <Section title={`Rejected (${rejected.length})`}>
        {rejected.length === 0 && <Empty text="No rejected posts." />}
        {rejected.map((p) => (
          <Row key={p.id} post={p}>
            <button className={btn} onClick={() => setStatus(p.id, "pending")}>
              Restore
            </button>
            <button className={btn} onClick={() => deletePost(p.id)}>
              Delete
            </button>
          </Row>
        ))}
      </Section>

      <Section title={`License requests (${requests.length})`}>
        {requests.length === 0 && <Empty text="No requests yet." />}
        {requests.map((r) => (
          <div key={r.id} className="border border-neutral-800 p-4 text-sm">
            <p className="text-neutral-200">
              {r.requester_name} · {r.requester_email}
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              For: {r.posts?.title ?? "(deleted post)"} ·{" "}
              {new Date(r.created_at).toLocaleDateString()}
            </p>
            <p className="mt-3 whitespace-pre-wrap text-neutral-400">{r.message}</p>
          </div>
        ))}
      </Section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-sm uppercase tracking-widest text-emerald-400">{title}</h2>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="text-sm text-neutral-600">{text}</p>;
}

function Row({ post, children }: { post: Post; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border border-neutral-800 p-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-widest text-neutral-500">
          {post.type}
          {post.featured && " · featured"}
        </p>
        <Link href={`/post/${post.slug}`} className="font-bold hover:text-emerald-400">
          {post.title}
        </Link>
        <p className="text-xs text-neutral-500">
          {post.author_name} · {new Date(post.created_at).toLocaleDateString()}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}