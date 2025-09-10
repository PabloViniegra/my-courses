"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Navbar from "@/components/shared/navbar";
import { User } from "@supabase/supabase-js";
import { User as LocalUser } from "@/types";

export function ClientNavbarWrapper() {
  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [localUser, setLocalUser] = useState<LocalUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCheckedUser, setHasCheckedUser] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    let mounted = true;
    const supabase = createClient();

    const loadUser = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Session error:", error);
          if (mounted) {
            setUser(null);
            setLocalUser(null);
            setIsLoading(false);
          }
          return;
        }

        if (session?.user && mounted) {
          setUser(session.user);

          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("supabaseId", session.user.id)
            .single();

          if (!userError && userData && mounted) {
            setLocalUser(userData as LocalUser);
          } else if (mounted) {
            console.log("No local user found:", userError);
            setLocalUser(null);
          }

          if (mounted) {
            setHasCheckedUser(true);
          }
        } else if (mounted) {
          setUser(null);
          setLocalUser(null);
          setHasCheckedUser(true);
        }
      } catch (error) {
        console.error("Error loading user:", error);
        if (mounted) {
          setUser(null);
          setLocalUser(null);
          setHasCheckedUser(true);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === "SIGNED_OUT") {
        setUser(null);
        setLocalUser(null);
        setHasCheckedUser(true);
      } else if (
        (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") &&
        session?.user
      ) {
        setUser(session.user);

        const { data: userData, error } = await supabase
          .from("users")
          .select("*")
          .eq("supabaseId", session.user.id)
          .single();

        if (!error && userData && mounted) {
          setLocalUser(userData as LocalUser);
        } else if (mounted) {
          setLocalUser(null);
        }

        if (mounted) {
          setHasCheckedUser(true);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [isMounted]);

  if (!isMounted || (isLoading && !hasCheckedUser)) {
    return (
      <header className="border-b px-4 md:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-muted animate-pulse" />
            <div className="h-6 w-24 rounded bg-muted animate-pulse" />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-20 rounded bg-muted animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  return <Navbar user={user} localUser={localUser} />;
}
