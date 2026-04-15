import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const SUPABASE_URL  = 'https://lvuucmuzsiogroypwzvn.supabase.co'
const SUPABASE_ANON = 'sb_publishable_8Q7GzdlMbTBHHKSWzwkl1A_JxizJAVW'

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    autoRefreshToken:   true,
    persistSession:     true,
    detectSessionInUrl: true,
    storageKey:         'royal-network-auth',
  },
})

export const db = {
  users:          () => supabase.from('users'),
  assets:         () => supabase.from('assets'),
  documents:      () => supabase.from('documents'),
  verifications:  () => supabase.from('verifications'),
  markets:        () => supabase.from('markets'),
  transactions:   () => supabase.from('transactions'),
  marketListings: () => supabase.from('v_market_listings'),
  userPortfolio:  () => supabase.from('v_user_portfolio'),
}