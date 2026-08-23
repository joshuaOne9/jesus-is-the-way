import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

// Fetches PUBLISHED posts for the public feed, newest first.
export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data, error: err } = await supabase
        .from("posts")
        .select("*, profiles:author_id(display_name)")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (cancelled) return;
      if (err) setError(err.message);
      else setPosts(data || []);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { posts, loading, error };
}

// Fetches the current user's OWN posts (drafts + published), for managing them.
export function useMyPosts(user) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    (async () => {
      const { data, error: err } = await supabase
        .from("posts")
        .select("*")
        .eq("author_id", user.id)
        .order("updated_at", { ascending: false });

      if (cancelled) return;
      if (err) setError(err.message);
      else setPosts(data || []);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [user, refreshKey]);

  function refresh() {
    setRefreshKey((k) => k + 1);
  }

  return { posts, loading, error, refresh };
}

// Create, update, delete helpers.
export async function createPost(
  user,
  { title, body, type = "teaching", status = "draft" },
) {
  const payload = {
    author_id: user.id,
    title,
    body,
    type,
    status,
  };
  if (status === "published") {
    payload.published_at = new Date().toISOString();
  }
  const { data, error } = await supabase
    .from("posts")
    .insert(payload)
    .select()
    .single();
  return { data, error };
}

export async function updatePost(postId, updates) {
  // If transitioning to published for the first time, stamp published_at
  const patch = { ...updates };
  if (updates.status === "published" && !updates.published_at) {
    patch.published_at = new Date().toISOString();
  }
  const { data, error } = await supabase
    .from("posts")
    .update(patch)
    .eq("id", postId)
    .select()
    .single();
  return { data, error };
}

export async function deletePost(postId) {
  const { error } = await supabase.from("posts").delete().eq("id", postId);
  return { error };
}

// Loads one post by id for editing in the composer.
export async function fetchPost(postId) {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .single();
  return { data, error };
}
