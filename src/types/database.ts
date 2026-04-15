export type UserRole           = 'user' | 'admin' | 'verifier'
export type KycStatus          = 'none' | 'pending' | 'approved' | 'rejected'
export type AssetStatus        = 'pending' | 'verified' | 'rejected' | 'listed' | 'delisted'
export type AssetType          = 'real_estate' | 'commodity' | 'equity' | 'bond' | 'fund' | 'other'
export type DocType            = 'title_deed' | 'valuation' | 'legal' | 'kyc' | 'prospectus' | 'other'
export type VerificationStatus = 'pending' | 'in_review' | 'approved' | 'rejected'
export type MarketStatus       = 'active' | 'paused' | 'closed'
export type TxType             = 'buy' | 'sell' | 'stake' | 'unstake' | 'mint' | 'redeem' | 'transfer'
export type TxStatus           = 'pending' | 'confirmed' | 'failed' | 'cancelled'
export type TokenSymbol        = 'RT' | 'RS' | 'BNB' | 'USDT' | 'USDC'

export interface UserRow {
  id:              string
  auth_id:         string | null
  email:           string | null
  username:        string | null
  wallet_address:  string | null
  wallet_chain_id: number | null
  full_name:       string | null
  avatar_url:      string | null
  bio:             string | null
  country:         string | null
  role:            UserRole
  kyc_status:      KycStatus
  is_active:       boolean
  rt_balance:      string
  rs_balance:      string
  created_at:      string
  updated_at:      string
  last_seen_at:    string | null
}

export interface AssetRow {
  id:               string
  owner_id:         string
  name:             string
  slug:             string | null
  description:      string | null
  asset_type:       AssetType
  status:           AssetStatus
  valuation_usd:    string | null
  total_supply:     string | null
  token_price_usd:  string | null
  anchor_tx_hash:   string | null
  anchor_block:     number | null
  rs_contract_addr: string | null
  chain_id:         number | null
  location:         string | null
  jurisdiction:     string | null
  asset_metadata:   Record<string, unknown>
  cover_image_url:  string | null
  images:           string[]
  view_count:       number
  investor_count:   number
  created_at:       string
  updated_at:       string
  listed_at:        string | null
  verified_at:      string | null
}

export interface MarketRow {
  id:                 string
  asset_id:           string
  status:             MarketStatus
  base_token:         TokenSymbol
  quote_token:        TokenSymbol
  current_price_usd:  string
  price_24h_ago:      string | null
  price_change_24h:   string | null
  price_high_24h:     string | null
  price_low_24h:      string | null
  volume_24h_usd:     string
  volume_total_usd:   string
  circulating_supply: string
  market_cap_usd:     string | null
  maker_fee_bps:      number
  taker_fee_bps:      number
  created_at:         string
  updated_at:         string
}

export interface TransactionRow {
  id:               string
  user_id:          string
  asset_id:         string | null
  market_id:        string | null
  tx_type:          TxType
  status:           TxStatus
  token_in:         TokenSymbol | null
  token_out:        TokenSymbol | null
  amount_in:        string | null
  amount_out:       string | null
  price_usd:        string | null
  total_usd:        string | null
  fee_usd:          string | null
  tx_hash:          string | null
  block_number:     number | null
  gas_used:         number | null
  gas_price_gwei:   string | null
  from_address:     string | null
  to_address:       string | null
  contract_address: string | null
  chain_id:         number | null
  notes:            string | null
  tx_metadata:      Record<string, unknown>
  created_at:       string
  confirmed_at:     string | null
  failed_at:        string | null
}

export interface MarketListing {
  market_id:          string
  market_status:      MarketStatus
  current_price_usd:  string
  price_change_24h:   string | null
  volume_24h_usd:     string
  market_cap_usd:     string | null
  circulating_supply: string
  maker_fee_bps:      number
  taker_fee_bps:      number
  asset_id:           string
  asset_name:         string
  asset_slug:         string | null
  asset_type:         AssetType
  cover_image_url:    string | null
  jurisdiction:       string | null
  valuation_usd:      string | null
  rs_contract_addr:   string | null
  owner_id:           string
  owner_username:     string | null
  owner_wallet:       string | null
}

export interface UserPortfolioItem {
  user_id:            string
  asset_id:           string
  asset_name:         string
  asset_type:         AssetType
  cover_image_url:    string | null
  current_price_usd:  string | null
  net_rs_balance:     string
  total_invested_usd: string
  tx_count:           number
}

export interface Database {
  public: {
    Tables: {
      users:         { Row: UserRow;         Insert: Partial<UserRow>;         Update: Partial<UserRow> }
      assets:        { Row: AssetRow;        Insert: Partial<AssetRow>;        Update: Partial<AssetRow> }
      markets:       { Row: MarketRow;       Insert: Partial<MarketRow>;       Update: Partial<MarketRow> }
      transactions:  { Row: TransactionRow;  Insert: Partial<TransactionRow>;  Update: Partial<TransactionRow> }
    }
    Views: {
      v_market_listings: { Row: MarketListing }
      v_user_portfolio:  { Row: UserPortfolioItem }
    }
    Functions: {}
    Enums: {}
  }
}