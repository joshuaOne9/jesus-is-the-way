import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recovering, setRecovering] = useState(false);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setRecovering(true);
      }
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load the profile (with role) whenever the logged-in user changes.
  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) {
      setProfile(null);
      return;
    }

    let cancelled = false;
    setProfileLoading(true);
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, role, avatar_url")
        .eq("id", userId)
        .maybeSingle();

      if (cancelled) return;
      if (!error) setProfile(data);
      setProfileLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  const role = profile?.role ?? "member";

  return {
    session,
    user: session?.user ?? null,
    profile,
    role,
    isLeader: role === "leader" || role === "admin",
    isAdmin: role === "admin",
    loading,
    profileLoading,
    recovering,
    setRecovering,
  };
}
