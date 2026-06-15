import { useState } from 'react'
import { supabase } from '../lib/supabase'

function ResetPassword({ onDone }) {
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    async function handleUpdate() {
        setError(null)
        setMessage(null)
        setSubmitting(true)

        const { error } = await supabase.auth.updateUser({ password })
        if (error) setError(error.message)
        else setMessage('Password updated! You are now signed in.')

        setSubmitting(false)
    }

    return (
        <section className="page">
            <header className="page-header">
                <p className="page-eyebrow">Account</p>
                <h1>Set a New Password</h1>
                <div className="page-divider"></div>
            </header>
            <div className="auth-box">
                <input
                    type="password"
                    className="auth-input"
                    placeholder="New password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p className="auth-error">{error}</p>}
                {message && <p className="auth-message">{message}</p>}

                {message ? (
                    <button className="auth-submit" onClick={onDone}>Continue</button>
                ) : (
                    <button className="auth-submit" onClick={handleUpdate} disabled={submitting}>
                        {submitting ? 'Updating...' : 'Update Password'}
                    </button>
                )}
            </div>
        </section>
    )
}

export default ResetPassword