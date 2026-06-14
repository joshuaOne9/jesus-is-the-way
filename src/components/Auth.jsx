import { useState } from 'react'
import { supabase } from '../lib/supabase'

function Auth({ user }) {
    const [mode, setMode] = useState('login')   // 'login' or 'signup'
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit() {
        setError(null)
        setMessage(null)
        setSubmitting(true)

        if (mode === 'signup') {
            const { error } = await supabase.auth.signUp({ email, password })
            if (error) setError(error.message)
            else setMessage('Account created!')
        } else {
            const { error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) setError(error.message)
        }

        setSubmitting(false)
    }

    async function handleLogout() {
        await supabase.auth.signOut()
    }

    // Logged in → show account info + logout
    if (user) {
        return (
            <section className="page">
                <header className="page-header">
                    <p className="page-eyebrow">Account</p>
                    <h1>Your Account</h1>
                    <div className="page-divider"></div>
                </header>
                <div className="auth-box">
                    <p className="auth-signed-in">Signed in as <strong>{user.email}</strong></p>
                    <button className="auth-submit" onClick={handleLogout}>Log out</button>
                </div>
            </section>
        )
    }

    // Logged out → show the form
    return (
        <section className="page">
            <header className="page-header">
                <p className="page-eyebrow">Account</p>
                <h1>{mode === 'login' ? 'Sign In' : 'Create an Account'}</h1>
                <div className="page-divider"></div>
            </header>

            <div className="auth-box">
                <input
                    type="email"
                    className="auth-input"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    className="auth-input"
                    placeholder="Password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && <p className="auth-error">{error}</p>}
                {message && <p className="auth-message">{message}</p>}

                <button className="auth-submit" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
                </button>

                <p className="auth-toggle">
                    {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <button
                        className="auth-toggle-btn"
                        onClick={() => {
                            setMode(mode === 'login' ? 'signup' : 'login')
                            setError(null)
                            setMessage(null)
                        }}
                    >
                        {mode === 'login' ? 'Sign up' : 'Sign in'}
                    </button>
                </p>
            </div>
        </section>
    )
}

export default Auth