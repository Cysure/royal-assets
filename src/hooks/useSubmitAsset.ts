import { useState } from 'react'
import { db } from '@/lib/supabase'

interface AssetFormData {
  name:                string
  asset_type:          string
  location:            string
  description:         string
  estimated_value_usd: number
}

interface SubmitResult {
  id:     string | null
  error:  string | null
  loading: boolean
}

export function useSubmitAsset() {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [assetId, setAssetId] = useState<string | null>(null)

  const submitAsset = async (formData: AssetFormData) => {
    setLoading(true)
    setError(null)
    setAssetId(null)

    try {
      const { data, error } = await db.assets()
        .insert({
          name:           formData.name,
          asset_type:     formData.asset_type as any,
          location:       formData.location,
          description:    formData.description,
          valuation_usd:  formData.estimated_value_usd,
          status:         'pending',
        })
        .select('id')
        .single()

      if (error) throw error

      setAssetId(data.id)
      return data.id

    } catch (err: any) {
      const message = err?.message ?? 'Something went wrong'
      setError(message)
      return null

    } finally {
      setLoading(false)
    }
  }

  return { submitAsset, loading, error, assetId }
}