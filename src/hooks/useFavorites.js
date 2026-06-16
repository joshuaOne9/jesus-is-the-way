import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useFavorites(user) {
    const [favorites, setFavorites] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) {
            setFavorites([])
            setLoading(false)
            return
        }

        async function loadFavorites() {
            const { data, error } = await supabase
                .from('favorites')
                .select('item_type, item_id')
                .eq('user_id', user.id)

            if (!error && data) setFavorites(data)
            setLoading(false)
        }

        loadFavorites()
    }, [user])

    function isFavorited(itemType, itemId) {
        return favorites.some((f) => f.item_type === itemType && f.item_id === itemId)
    }

    async function toggleFavorite(itemType, itemId) {
        if (!user) return

        if (isFavorited(itemType, itemId)) {
            const { error } = await supabase
                .from('favorites')
                .delete()
                .eq('user_id', user.id)
                .eq('item_type', itemType)
                .eq('item_id', itemId)

            if (!error) {
                setFavorites((prev) =>
                    prev.filter((f) => !(f.item_type === itemType && f.item_id === itemId))
                )
            }
        } else {
            const { error } = await supabase
                .from('favorites')
                .insert({ user_id: user.id, item_type: itemType, item_id: itemId })

            if (!error) {
                setFavorites((prev) => [...prev, { item_type: itemType, item_id: itemId }])
            }
        }
    }

    return { favorites, loading, isFavorited, toggleFavorite }
}