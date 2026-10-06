"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthButton() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setLoggedIn(!!session);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const linkClass = "uppercase transition-colors hover:text-ac";

  if (!loggedIn) {
    return (
      <Link href="/login" className={linkClass}>
        Log in
      </Link>
    );
  }

  return (
    <>
      <Link href="/submit" className={linkClass}>
        Submit
      </Link>
      <button onClick={handleLogout} className={linkClass}>
        Log out
      </button>
    </>
  );
}