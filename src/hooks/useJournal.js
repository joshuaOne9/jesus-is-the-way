import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useJournal(user) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    let cancelled = false;

    (async () => {
      const { data, error: err } = await supabase
        .from("journal_entries")
        .select("*")
        .order("created_at", { ascending: false });

      if (cancelled) return;

      if (err) {
        setError(err.message);
      } else {
        setEntries(data || []);
        setError(null);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  async function createEntry({ title, content, tags = [] }) {
    if (!user) return null;
    const { data, error: err } = await supabase
      .from("journal_entries")
      .insert({
        user_id: user.id,
        title: title || null,
        content,
        tags,
      })
      .select()
      .single();
    if (err) {
      setError(err.message);
      return null;
    }
    setEntries((prev) => [data, ...prev]);
    return data;
  }

  async function updateEntry(id, updates) {
    if (!user) return null;
    const { data, error: err } = await supabase
      .from("journal_entries")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (err) {
      setError(err.message);
      return null;
    }
    setEntries((prev) => prev.map((e) => (e.id === id ? data : e)));
    return data;
  }

  async function deleteEntry(id) {
    if (!user) return false;
    const { error: err } = await supabase
      .from("journal_entries")
      .delete()
      .eq("id", id);
    if (err) {
      setError(err.message);
      return false;
    }
    setEntries((prev) => prev.filter((e) => e.id !== id));
    return true;
  }

  return { entries, loading, error, createEntry, updateEntry, deleteEntry };
}
