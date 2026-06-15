import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useAuth() {
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)
    const [recovering, setRecovering] = useState(false)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setLoading(false)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                setRecovering(true)
            }
            setSession(session)
        })

        return () => subscription.unsubscribe()
    }, [])

    return { session, user: session?.user ?? null, loading, recovering, setRecovering }
}