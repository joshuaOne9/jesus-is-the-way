import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

function Profile({ user }) {
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [role, setRole] = useState("member");

  // Load the user's existing profile on mount
  useEffect(() => {
    async function loadProfile() {
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, bio, role")
        .eq("id", user.id)
        .maybeSingle();

      if (error) setError(error.message);
      else if (data) {
        setDisplayName(data.display_name ?? "");
        setBio(data.bio ?? "");
        setRole(data.role ?? "member");
      }
      setLoading(false);
    }

    loadProfile();
  }, [user.id]);

  async function handleSave() {
    setError(null);
    setMessage(null);
    setSaving(true);

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      display_name: displayName,
      bio: bio,
      updated_at: new Date().toISOString(),
    });

    if (error) setError(error.message);
    else setMessage("Profile saved!");

    setSaving(false);
  }

  if (loading) {
    return (
      <div className="auth-box">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="auth-box">
      <label className="profile-label">Display Name</label>
      <p className="profile-label" style={{ marginTop: "4px" }}>
        Role: <strong>{role}</strong>
      </p>
      <input
        type="text"
        className="auth-input"
        placeholder="How others will see you"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />

      <label className="profile-label">Bio</label>
      <textarea
        className="auth-input profile-textarea"
        placeholder="A short bio (optional)"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        rows={4}
      />

      {error && <p className="auth-error">{error}</p>}
      {message && <p className="auth-message">{message}</p>}

      <button className="auth-submit" onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
}

export default Profile;
