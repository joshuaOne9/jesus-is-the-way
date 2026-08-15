import { useState } from "react";
import { supabase } from "../lib/supabase";
import Profile from "./Profile";

function Auth({ user }) {
  const [mode, setMode] = useState("login"); // 'login', 'signup', or 'reset'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function clearFeedback() {
    setError(null);
    setMessage(null);
  }

  async function handleSubmit() {
    clearFeedback();

    if (mode === "signup" && !displayName.trim()) {
      setError("Please choose a display name.");
      return;
    }

    setSubmitting(true);

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName.trim() },
        },
      });
      if (error) {
        setError(error.message);
      } else {
        // Create the profile row with the chosen display name.
        if (data.user) {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            display_name: displayName.trim(),
          });
        }
        setMessage("Account created!");
      }
    } else if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setError(error.message);
    } else if (mode === "reset") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) setError(error.message);
      else setMessage("Check your email for a password reset link.");
    }

    setSubmitting(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  if (user) {
    return (
      <section className="page">
        <header className="page-header">
          <p className="page-eyebrow">Account</p>
          <h1>Your Account</h1>
          <div className="page-divider"></div>
        </header>

        <Profile user={user} />

        <div className="auth-box" style={{ marginTop: "16px" }}>
          <p className="auth-signed-in">
            Signed in as <strong>{user.email}</strong>
          </p>
          <button className="auth-submit" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </section>
    );
  }

  const heading =
    mode === "login"
      ? "Sign In"
      : mode === "signup"
        ? "Create an Account"
        : "Reset Your Password";

  return (
    <section className="page">
      <header className="page-header">
        <p className="page-eyebrow">Account</p>
        <h1>{heading}</h1>
        <div className="page-divider"></div>
      </header>

      <div className="auth-box">
        {mode === "signup" && (
          <input
            type="text"
            className="auth-input"
            placeholder="Display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        )}

        <input
          type="email"
          className="auth-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {mode !== "reset" && (
          <div className="auth-password-wrap">
            <input
              type={showPassword ? "text" : "password"}
              className="auth-input"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="auth-show-toggle"
              onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        )}

        {error && <p className="auth-error">{error}</p>}
        {message && <p className="auth-message">{message}</p>}

        <button
          className="auth-submit"
          onClick={handleSubmit}
          disabled={submitting}>
          {submitting
            ? "Please wait..."
            : mode === "login"
              ? "Sign In"
              : mode === "signup"
                ? "Sign Up"
                : "Send Reset Link"}
        </button>

        {mode === "login" && (
          <p className="auth-toggle">
            <button
              className="auth-toggle-btn"
              onClick={() => {
                setMode("reset");
                clearFeedback();
              }}>
              Forgot password?
            </button>
          </p>
        )}

        <p className="auth-toggle">
          {mode === "login" && (
            <>
              Don't have an account?{" "}
              <button
                className="auth-toggle-btn"
                onClick={() => {
                  setMode("signup");
                  clearFeedback();
                }}>
                Sign up
              </button>
            </>
          )}
          {mode === "signup" && (
            <>
              Already have an account?{" "}
              <button
                className="auth-toggle-btn"
                onClick={() => {
                  setMode("login");
                  clearFeedback();
                }}>
                Sign in
              </button>
            </>
          )}
          {mode === "reset" && (
            <>
              Remembered it?{" "}
              <button
                className="auth-toggle-btn"
                onClick={() => {
                  setMode("login");
                  clearFeedback();
                }}>
                Back to sign in
              </button>
            </>
          )}
        </p>
      </div>
    </section>
  );
}

export default Auth;
