"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import CountUp from "@/components/CountUp";

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
  views?: number | null;
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

type Stats = {
  users_total: number;
  users_new: number;
  daily: { day: string; views: number }[];
};

type Tab = "overview" | "review" | "licenses";

const getViews = (p: Post) => p.views ?? 0;
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const typeLabel = (t: string) => cap(t) + (t.endsWith("s") ? "" : "s");
const fmtDay = (iso: string) =>
  new Date(`${iso}T00:00:00Z`)
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      timeZone: "UTC",
    })
    .toUpperCase();

const pill = (on: boolean) =>
  `mo rounded-full border px-4 py-2 transition-colors ${
    on ? "border-paper bg-paper text-ink" : "border-paper/30 hover:border-paper"
  }`;

const act =
  "mo rounded-full border border-paper/30 px-4 py-2 transition-colors hover:border-paper hover:bg-paper hover:text-ink";

const card = "rounded-[2rem] border border-paper/30 p-6";

export default function AdminPage() {
  const router = useRouter();
  const [state, setState] = useState<"loading" | "denied" | "ok">("loading");
  const [email, setEmail] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [requests, setRequests] = useState<LicenseRequest[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsErr, setStatsErr] = useState("");
  const [error, setError] = useState("");

  const [tab, setTab] = useState<Tab>("overview");
  const [mod, setMod] = useState<Post["status"]>("pending");
  const [type, setType] = useState("all");
  const [days, setDays] = useState(30);

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
      setEmail(session.session.user.email ?? "");

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

  // users + views-over-time (re-runs when the range or content type changes)
  useEffect(() => {
    if (state !== "ok") return;
    let stale = false;
    supabase
      .rpc("admin_stats", {
        p_days: days,
        p_type: type === "all" ? null : type,
      })
      .then(({ data, error }) => {
        if (stale) return;
        if (error) {
          setStatsErr(error.message);
          return;
        }
        setStatsErr("");
        setStats(data as Stats);
      });
    return () => {
      stale = true;
    };
  }, [state, days, type]);

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

  const pending = useMemo(() => posts.filter((p) => p.status === "pending"), [posts]);
  const published = useMemo(() => posts.filter((p) => p.status === "published"), [posts]);
  const rejected = useMemo(() => posts.filter((p) => p.status === "rejected"), [posts]);

  // which kind of content readers prefer
  const byType = useMemo(() => {
    const m = new Map<string, { type: string; posts: number; views: number }>();
    published.forEach((p) => {
      const r = m.get(p.type) ?? { type: p.type, posts: 0, views: 0 };
      r.posts += 1;
      r.views += getViews(p);
      m.set(p.type, r);
    });
    return Array.from(m.values()).sort(
      (a, b) => b.views - a.views || b.posts - a.posts
    );
  }, [published]);

  const totalViews = byType.reduce((s, t) => s + t.views, 0);
  const maxTypeViews = Math.max(...byType.map((t) => t.views), 1);
  const favourite = byType[0];
  const share =
    favourite && totalViews > 0
      ? Math.round((favourite.views / totalViews) * 100)
      : 0;

  // most viewed posts for the chosen type
  const topPosts = useMemo(
    () =>
      published
        .filter((p) => type === "all" || p.type === type)
        .sort((a, b) => getViews(b) - getViews(a))
        .slice(0, 8),
    [published, type]
  );
  const maxPostViews = Math.max(...topPosts.map(getViews), 1);

  const rangeViews = stats ? stats.daily.reduce((s, d) => s + d.views, 0) : 0;

  if (state === "loading") return null;

  if (state === "denied") {
    return (
      <main className="flex-1 p-6">
        <p className="text-sm text-mu">You do not have access to this page.</p>
      </main>
    );
  }

  const nav: { id: Tab; label: string; count?: number }[] = [
    { id: "overview", label: "Overview" },
    { id: "review", label: "Review queue", count: pending.length },
    { id: "licenses", label: "License requests", count: requests.length },
  ];

  const modList = mod === "pending" ? pending : mod === "published" ? published : rejected;

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-10">
      <div className="mo flex items-center justify-between gap-4">
        <span className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ac opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-ac" />
          </span>
          (Admin console)
        </span>
        <span className="truncate">{email}</span>
      </div>

      <h1 className="font-display mt-6 text-[clamp(40px,7vw,110px)] uppercase leading-[0.9] tracking-[-0.02em]">
        Dashboard
      </h1>

      <div className="mt-10 grid gap-8 lg:grid-cols-[230px_minmax(0,1fr)]">
        {/* sidebar */}
        <aside>
          <nav className="flex flex-row flex-wrap gap-2 lg:sticky lg:top-24 lg:flex-col lg:gap-2">
            {nav.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => setTab(n.id)}
                className={`mo flex items-center justify-between gap-3 rounded-full border px-5 py-3 text-left transition-colors ${
                  tab === n.id
                    ? "border-paper bg-paper text-ink"
                    : "border-paper/30 hover:border-paper"
                }`}
              >
                {n.label}
                {n.count !== undefined && n.count > 0 && (
                  <span
                    className={`rounded-full px-2 py-0.5 ${
                      tab === n.id ? "bg-ink text-paper" : "bg-ac text-white"
                    }`}
                  >
                    {n.count}
                  </span>
                )}
              </button>
            ))}
            <Link
              href="/"
              className="mo rounded-full px-5 py-3 opacity-70 transition-opacity hover:opacity-100 lg:mt-6"
            >
              ← Back to site
            </Link>
          </nav>
        </aside>

        {/* content */}
        <div className="min-w-0">
          {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

          {tab === "overview" && (
            <div className="space-y-4">
              {statsErr && (
                <div className="rounded-2xl border border-ac/60 p-4 font-mono text-sm text-mu">
                  <span className="text-ac">$</span> user and daily-view stats
                  are not set up yet. Run{" "}
                  <span className="text-tx">supabase/dashboard.sql</span> in the
                  Supabase SQL editor, then reload. ({statsErr})
                </div>
              )}

              {/* headline tiles */}
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <Tile
                  cream
                  label="Total users"
                  value={stats ? stats.users_total : null}
                  note={
                    stats
                      ? `+${stats.users_new} in the last ${days} days`
                      : "waiting for stats"
                  }
                />
                <Tile
                  label="Published posts"
                  value={published.length}
                  note={`${posts.length} in total`}
                />
                <Tile
                  label="Total views"
                  value={totalViews}
                  note={
                    favourite && totalViews > 0
                      ? `${typeLabel(favourite.type)} lead with ${share}%`
                      : "no views recorded yet"
                  }
                />
                <Tile
                  label="Pending review"
                  value={pending.length}
                  note="tap to review"
                  onClick={() => setTab("review")}
                />
              </div>

              <div className="grid gap-4 lg:grid-cols-12">
                {/* preferred content */}
                <section className={`${card} lg:col-span-5`}>
                  <p className="mo">(What readers prefer)</p>
                  <h2 className="font-display mt-2 text-[clamp(26px,2.6vw,38px)] uppercase leading-[0.95]">
                    Content by views
                  </h2>
                  <p className="mt-2 text-sm text-mu">
                    Tap a type to filter the chart and the list below.
                  </p>

                  <ul className="mt-5 space-y-2">
                    {byType.length === 0 && (
                      <li className="text-sm text-mu">No published posts yet.</li>
                    )}
                    {byType.map((t) => {
                      const on = type === t.type;
                      return (
                        <li key={t.type}>
                          <button
                            type="button"
                            onClick={() => setType(on ? "all" : t.type)}
                            className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                              on
                                ? "border-paper bg-paper text-ink"
                                : "border-paper/20 hover:border-paper/60"
                            }`}
                          >
                            <span className="flex items-baseline justify-between gap-3">
                              <span className="font-display text-xl uppercase">
                                {typeLabel(t.type)}
                              </span>
                              <span className="mo">
                                {t.posts} {t.posts === 1 ? "post" : "posts"}
                              </span>
                            </span>
                            <span
                              className={`mt-3 block h-2 overflow-hidden rounded-full ${
                                on ? "bg-ink/15" : "bg-paper/10"
                              }`}
                            >
                              <span
                                className={`block h-full rounded-full ${
                                  on ? "bg-ink" : "bg-ac"
                                }`}
                                style={{
                                  width: `${(t.views / maxTypeViews) * 100}%`,
                                }}
                              />
                            </span>
                            <span className="mo mt-2 block">
                              {t.views.toLocaleString("en-US")} views
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>

                {/* views over time */}
                <section className={`${card} lg:col-span-7`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="mo">(Performance)</p>
                      <h2 className="font-display mt-2 text-[clamp(26px,2.6vw,38px)] uppercase leading-[0.95]">
                        Views over time
                      </h2>
                    </div>
                    <div className="flex gap-2">
                      {[7, 30, 90].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDays(d)}
                          className={pill(days === d)}
                        >
                          {d}D
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className="mo mt-3">
                    {type === "all" ? "All content" : typeLabel(type)} ·{" "}
                    {rangeViews.toLocaleString("en-US")} views in {days} days
                  </p>

                  {stats ? (
                    <AreaChart data={stats.daily} />
                  ) : (
                    <p className="mt-10 text-sm text-mu">
                      {statsErr ? "Chart unavailable." : "Loading…"}
                    </p>
                  )}
                </section>
              </div>

              {/* most viewed */}
              <section className={card}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="mo">(Most viewed)</p>
                    <h2 className="font-display mt-2 text-[clamp(26px,2.6vw,38px)] uppercase leading-[0.95]">
                      {type === "all" ? "Top posts" : `Top ${type} posts`}
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["all", ...byType.map((t) => t.type)].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        className={pill(type === t)}
                      >
                        {t === "all" ? "All" : typeLabel(t)}
                      </button>
                    ))}
                  </div>
                </div>

                <ul className="mt-6 border-t border-paper/20">
                  {topPosts.length === 0 && (
                    <li className="py-6 text-sm text-mu">
                      Nothing published in this category yet.
                    </li>
                  )}
                  {topPosts.map((p, i) => (
                    <li key={p.id} className="border-b border-paper/20">
                      <Link
                        href={`/post/${p.slug}`}
                        className="group grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-4 py-4 transition-all duration-300 hover:bg-paper hover:px-4 hover:text-ink"
                      >
                        <span className="font-display text-xl opacity-40 group-hover:opacity-100">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-base font-semibold uppercase">
                            {p.title}
                          </span>
                          <span className="mo mt-1 block opacity-60">
                            {p.type} · {p.author_name}
                          </span>
                          <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-paper/10 group-hover:bg-ink/15">
                            <span
                              className="block h-full rounded-full bg-ac group-hover:bg-ink"
                              style={{
                                width: `${(getViews(p) / maxPostViews) * 100}%`,
                              }}
                            />
                          </span>
                        </span>
                        <span className="text-right">
                          <span className="font-display block text-2xl leading-none">
                            {getViews(p).toLocaleString("en-US")}
                          </span>
                          <span className="mo">views</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          )}

          {tab === "review" && (
            <section>
              <div className="mb-6 flex flex-wrap gap-2">
                {(
                  [
                    ["pending", "Pending", pending.length],
                    ["published", "Published", published.length],
                    ["rejected", "Rejected", rejected.length],
                  ] as const
                ).map(([k, label, n]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setMod(k)}
                    className={pill(mod === k)}
                  >
                    {label} ({n})
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                {modList.length === 0 && (
                  <p className="rounded-2xl border border-paper/20 p-6 text-sm text-mu">
                    {mod === "pending"
                      ? "Nothing waiting for review."
                      : mod === "rejected"
                        ? "No rejected posts."
                        : "No published posts."}
                  </p>
                )}
                {modList.map((p) => (
                  <Row key={p.id} post={p}>
                    {mod === "pending" && (
                      <>
                        <button className={act} onClick={() => setStatus(p.id, "published")}>
                          Approve
                        </button>
                        <button className={act} onClick={() => setStatus(p.id, "rejected")}>
                          Reject
                        </button>
                      </>
                    )}
                    {mod === "published" && (
                      <>
                        <button className={act} onClick={() => toggleFeatured(p)}>
                          {p.featured ? "Unfeature" : "Feature"}
                        </button>
                        <button className={act} onClick={() => setStatus(p.id, "pending")}>
                          Unpublish
                        </button>
                        <button className={act} onClick={() => deletePost(p.id)}>
                          Delete
                        </button>
                      </>
                    )}
                    {mod === "rejected" && (
                      <>
                        <button className={act} onClick={() => setStatus(p.id, "pending")}>
                          Restore
                        </button>
                        <button className={act} onClick={() => deletePost(p.id)}>
                          Delete
                        </button>
                      </>
                    )}
                  </Row>
                ))}
              </div>
            </section>
          )}

          {tab === "licenses" && (
            <section className="flex flex-col gap-3">
              {requests.length === 0 && (
                <p className="rounded-2xl border border-paper/20 p-6 text-sm text-mu">
                  No requests yet.
                </p>
              )}
              {requests.map((r) => (
                <div key={r.id} className="rounded-2xl border border-paper/20 p-5 text-sm">
                  <p className="text-tx">
                    {r.requester_name} · {r.requester_email}
                  </p>
                  <p className="mo mt-1">
                    For: {r.posts?.title ?? "(deleted post)"} ·{" "}
                    {new Date(r.created_at).toLocaleDateString()}
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-mu">{r.message}</p>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

function Tile({
  label,
  value,
  note,
  cream,
  onClick,
}: {
  label: string;
  value: number | null;
  note: string;
  cream?: boolean;
  onClick?: () => void;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      {...(onClick ? { type: "button" as const, onClick } : {})}
      className={`rounded-[2rem] border p-5 text-left ${
        cream
          ? "border-transparent bg-paper text-ink"
          : "border-paper/30"
      } ${onClick ? "transition-colors hover:border-paper" : ""}`}
    >
      <p className="mo">{label}</p>
      <p className="font-display mt-4 text-[clamp(36px,4.4vw,64px)] leading-none">
        {value === null ? "—" : <CountUp to={value} />}
      </p>
      <p className="mo mt-3 opacity-70">{note}</p>
    </Tag>
  );
}

function Row({ post, children }: { post: Post; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-paper/20 p-5 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <p className="mo">
          {post.type}
          {post.featured && " · featured"}
        </p>
        <Link
          href={`/post/${post.slug}`}
          className="mt-1 block truncate font-semibold uppercase hover:text-ac"
        >
          {post.title}
        </Link>
        <p className="mo mt-1 opacity-60">
          {post.author_name} · {new Date(post.created_at).toLocaleDateString()}
          {post.status === "published" &&
            ` · ${getViews(post).toLocaleString("en-US")} views`}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

// Area chart with a hover read-out. Plain SVG, no chart library.
function AreaChart({ data }: { data: { day: string; views: number }[] }) {
  const [hi, setHi] = useState<number | null>(null);

  const W = 800;
  const H = 240;
  const L = 8;
  const R = 8;
  const T = 12;
  const B = 12;

  const n = data.length;
  const peak = Math.max(...data.map((d) => d.views), 0);
  const top = Math.max(4, Math.ceil(peak / 4) * 4);

  const x = (i: number) => L + (n <= 1 ? 0 : (i / (n - 1)) * (W - L - R));
  const y = (v: number) => T + (1 - v / top) * (H - T - B);

  const line = data
    .map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(d.views).toFixed(1)}`)
    .join(" ");
  const area = n
    ? `${line} L${x(n - 1).toFixed(1)},${H - B} L${x(0).toFixed(1)},${H - B} Z`
    : "";

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (n === 0) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    const i = Math.round(((px - L) / (W - L - R)) * (n - 1));
    setHi(Math.min(n - 1, Math.max(0, i)));
  };

  const empty = peak === 0;
  const mid = Math.floor((n - 1) / 2);

  return (
    <div className="mt-6">
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block h-auto w-full touch-pan-y text-paper"
          onPointerMove={onMove}
          onPointerLeave={() => setHi(null)}
          role="img"
          aria-label="Views over time"
        >
          <defs>
            <linearGradient id="adm-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="currentColor" stopOpacity="0.32" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0, 1, 2, 3, 4].map((k) => (
            <line
              key={k}
              x1={L}
              x2={W - R}
              y1={y((top / 4) * k)}
              y2={y((top / 4) * k)}
              stroke="currentColor"
              strokeOpacity="0.14"
              strokeDasharray={k === 0 ? undefined : "3 5"}
            />
          ))}

          {n > 0 && <path d={area} fill="url(#adm-area)" />}
          {n > 0 && (
            <path
              d={line}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          )}

          {hi !== null && n > 0 && (
            <>
              <line
                x1={x(hi)}
                x2={x(hi)}
                y1={T}
                y2={H - B}
                stroke="currentColor"
                strokeOpacity="0.4"
                strokeDasharray="4 4"
              />
              <circle
                cx={x(hi)}
                cy={y(data[hi].views)}
                r="6"
                style={{ fill: "var(--color-ac)" }}
                stroke="currentColor"
                strokeWidth="2"
              />
            </>
          )}
        </svg>

        {hi !== null && n > 0 && (
          <div
            className="mo pointer-events-none absolute top-0 -translate-x-1/2 whitespace-nowrap rounded-xl bg-paper px-3 py-2 text-ink"
            style={{
              left: `${Math.min(88, Math.max(12, (x(hi) / W) * 100))}%`,
            }}
          >
            {fmtDay(data[hi].day)} · {data[hi].views.toLocaleString("en-US")}{" "}
            {data[hi].views === 1 ? "view" : "views"}
          </div>
        )}

        {empty && (
          <p className="mo pointer-events-none absolute inset-0 flex items-center justify-center text-center opacity-70">
            No views recorded in this range yet
          </p>
        )}
      </div>

      {n > 0 && (
        <div className="mo mt-2 flex justify-between">
          <span>{fmtDay(data[0].day)}</span>
          <span>{fmtDay(data[mid].day)}</span>
          <span>{fmtDay(data[n - 1].day)}</span>
        </div>
      )}
    </div>
  );
}