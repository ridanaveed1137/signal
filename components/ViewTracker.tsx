"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

// Drop <ViewTracker slug={post.slug} /> into the post page.
// Counts one view per visitor per post per browser session, so refreshing
// the page does not inflate the numbers.
export default function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    try {
      const key = `viewed:${slug}`;
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* storage blocked: count it anyway */
    }
    supabase.rpc("track_post_view", { p_slug: slug }).then(
      () => {},
      () => {}
    );
  }, [slug]);

  return null;
}