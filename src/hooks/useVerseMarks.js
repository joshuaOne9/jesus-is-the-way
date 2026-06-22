import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function useVerseMarks(user, bookName, chapter) {
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !bookName || !chapter) {
      return;
    }

    let cancelled = false;

    (async () => {
      const { data, error: err } = await supabase
        .from("verse_marks")
        .select("*")
        .eq("book_name", bookName)
        .eq("chapter", chapter);

      if (cancelled) return;

      if (err) {
        setError(err.message);
      } else {
        const map = {};
        (data || []).forEach((m) => {
          map[m.verse] = m;
        });
        setMarks(map);
        setError(null);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [user, bookName, chapter]);

  async function upsertMark(verse, { categoryId = null, note = null }) {
    if (!user) return null;
    const { data, error: err } = await supabase
      .from("verse_marks")
      .upsert(
        {
          user_id: user.id,
          book_name: bookName,
          chapter,
          verse,
          category_id: categoryId,
          note: note || null,
        },
        { onConflict: "user_id,book_name,chapter,verse" },
      )
      .select()
      .single();
    if (err) {
      setError(err.message);
      return null;
    }
    setMarks((prev) => ({ ...prev, [verse]: data }));
    return data;
  }

  async function deleteMark(verse) {
    if (!user) return false;
    const mark = marks[verse];
    if (!mark) return true;
    const { error: err } = await supabase
      .from("verse_marks")
      .delete()
      .eq("id", mark.id);
    if (err) {
      setError(err.message);
      return false;
    }
    setMarks((prev) => {
      const next = { ...prev };
      delete next[verse];
      return next;
    });
    return true;
  }

  return { marks, loading, error, upsertMark, deleteMark };
}
