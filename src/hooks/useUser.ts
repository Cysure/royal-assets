import { useEffect, useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, db } from '@/lib/supabase'
import type { UserRow } from '@/types/database'
import type { Session } from '@supabase/supabase-js'

export function useSession() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  return { session, user: session?.user ?? null, loading }
}

export function useCurrentUser() {
  const { user } = useSession()

  return useQuery({
    queryKey: ['user', 'profile', user?.id],
    enabled:  !!user,
    queryFn:  async () => {
      const { data, error } = await db.users()
        .select('*')
        .eq('auth_id', user!.id)
        .single()
      if (error) throw error
      return data as UserRow
    },
  })
}

export function useUpdateProfile() {
  const { data: profile } = useCurrentUser()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (updates: Partial<UserRow>) => {
      if (!profile) throw new Error('No profile loaded')
      const { data, error } = await db.users()
        .update(updates)
        .eq('id', profile.id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['user', 'profile'] }),
  })
}

export function useSignOut() {
  const qc = useQueryClient()
  return useCallback(async () => {
    await supabase.auth.signOut()
    qc.clear()
  }, [qc])
}