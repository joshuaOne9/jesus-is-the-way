import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useAllVerseMarks(user) {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    (async () => {
      const { data, error: err } = await supabase
        .from("verse_marks")
        .select("*")
        .order("book_name", { ascending: true })
        .order("chapter", { ascending: true })
        .order("verse", { ascending: true });

      if (cancelled) return;

      if (err) {
        setError(err.message);
      } else {
        setMarks(data || []);
        setError(null);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  return { marks, loading, error };
}
