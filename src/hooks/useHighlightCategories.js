import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

export function useHighlightCategories(user) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    if (!user) {
      setCategories([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("highlight_categories")
      .select("*")
      .order("created_at", { ascending: true });
    if (err) setError(err.message);
    else setCategories(data || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  async function createCategory(name, color) {
    if (!user) return null;
    const { data, error: err } = await supabase
      .from("highlight_categories")
      .insert({ user_id: user.id, name, color })
      .select()
      .single();
    if (err) {
      setError(err.message);
      return null;
    }
    setCategories((prev) => [...prev, data]);
    return data;
  }

  async function updateCategory(id, updates) {
    if (!user) return null;
    const { data, error: err } = await supabase
      .from("highlight_categories")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (err) {
      setError(err.message);
      return null;
    }
    setCategories((prev) => prev.map((c) => (c.id === id ? data : c)));
    return data;
  }

  async function deleteCategory(id) {
    if (!user) return false;
    const { error: err } = await supabase
      .from("highlight_categories")
      .delete()
      .eq("id", id);
    if (err) {
      setError(err.message);
      return false;
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
    return true;
  }

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
