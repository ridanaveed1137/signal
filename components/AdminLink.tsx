"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// Shows an "Admin" link only while an admin is signed in.
// Visitors and non-admin users never see it. Updates on login / logout
// without a page refresh.
export default function AdminLink({
  className = "mo transition-colors hover:text-ac",
  label = "Admin",
  onClick,
}: {
  className?: string;
  label?: string;
  onClick?: () => void;
}) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let alive = true;

    const check = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        if (alive) setIsAdmin(false);
        return;
      }
      const { data: ok } = await supabase.rpc("is_admin");
      if (alive) setIsAdmin(Boolean(ok));
    };

    check();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      check();
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (!isAdmin) return null;

  return (
    <Link href="/admin" className={className} onClick={onClick}>
      {label}
    </Link>
  );
}