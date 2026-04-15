import { useState } from 'react'
import { useSubmitAsset } from '@/hooks/useSubmitAsset'

const ASSET_TYPES = [
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'commodity',   label: 'Commodity'   },
  { value: 'equity',      label: 'Equity'       },
  { value: 'bond',        label: 'Bond'         },
  { value: 'fund',        label: 'Fund'         },
  { value: 'other',       label: 'Other'        },
]

export function AssetSubmitForm() {
  const { submitAsset, loading, error, assetId } = useSubmitAsset()

  const [form, setForm] = useState({
    name:                '',
    asset_type:          'real_estate',
    location:            '',
    description:         '',
    estimated_value_usd: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name)                { alert('Name is required');  return }
    if (!form.location)            { alert('Location is required'); return }
    if (!form.estimated_value_usd) { alert('Value is required'); return }

    const id = await submitAsset({
      name:                form.name,
      asset_type:          form.asset_type,
      location:            form.location,
      description:         form.description,
      estimated_value_usd: parseFloat(form.estimated_value_usd),
    })

    if (id) {
      alert(`Asset submitted! ID: ${id}`)
      setForm({
        name:                '',
        asset_type:          'real_estate',
        location:            '',
        description:         '',
        estimated_value_usd: '',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: '0 auto' }}>
      <h2>Submit Asset</h2>

      {/* Name */}
      <div style={{ marginBottom: 16 }}>
        <label>Asset Name *</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Dubai Marina Apartment"
          style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
        />
      </div>

      {/* Type */}
      <div style={{ marginBottom: 16 }}>
        <label>Asset Type *</label>
        <select
          name="asset_type"
          value={form.asset_type}
          onChange={handleChange}
          style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
        >
          {ASSET_TYPES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* Location */}
      <div style={{ marginBottom: 16 }}>
        <label>Location *</label>
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="e.g. Dubai, UAE"
          style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
        />
      </div>

      {/* Value */}
      <div style={{ marginBottom: 16 }}>
        <label>Estimated Value (USD) *</label>
        <input
          name="estimated_value_usd"
          type="number"
          value={form.estimated_value_usd}
          onChange={handleChange}
          placeholder="e.g. 500000"
          style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
        />
      </div>

      {/* Description */}
      <div style={{ marginBottom: 16 }}>
        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the asset..."
          rows={4}
          style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
        />
      </div>

      {/* Error */}
      {error && (
        <div style={{ color: 'red', marginBottom: 16 }}>
          Error: {error}
        </div>
      )}

      {/* Success */}
      {assetId && (
        <div style={{ color: 'green', marginBottom: 16 }}>
          ✓ Asset created — ID: {assetId}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        style={{
          width:           '100%',
          padding:         12,
          backgroundColor: loading ? '#ccc' : '#B8860B',
          color:           'white',
          border:          'none',
          borderRadius:    6,
          cursor:          loading ? 'not-allowed' : 'pointer',
          fontSize:        16,
        }}
      >
        {loading ? 'Submitting...' : 'Submit Asset'}
      </button>
    </form>
  )
}