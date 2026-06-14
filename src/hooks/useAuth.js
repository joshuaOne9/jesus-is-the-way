import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useAuth() {
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check for an existing session on load (e.g., after a refresh)
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setLoading(false)
        })

        // Listen for auth changes - login, logout, token refresh
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        // Cleanup: stop listening when the component unmounts
        return () => subscription.unsubscribe()
    }, [])

    return { session, user: session?.user ?? null, loading }
}