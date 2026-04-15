export interface Asset {
  id: string;
  name: string;
  type: string;
  value: number;
  status: "Verified" | "Pending" | "Unverified";
  backingRatio: number;
  location: string;
  verification: {
    legal: { done: boolean; timestamp?: string; hash?: string };
    technical: { done: boolean; timestamp?: string; hash?: string };
    auditor: { done: boolean; timestamp?: string; hash?: string };
    network: { done: boolean; timestamp?: string; hash?: string };
  };
  documentHash?: string;
  validatorConfirmations?: number;
}

export const assets: Asset[] = [
  {
    id: "rGOLD-001", name: "rGOLD-001", type: "Gold", value: 185400, status: "Verified", backingRatio: 1.02, location: "Zurich, Switzerland",
    verification: {
      legal: { done: true, timestamp: "2025-03-15T10:30:00Z", hash: "0x8a3f...e2c1" },
      technical: { done: true, timestamp: "2025-03-16T14:00:00Z", hash: "0x7b2e...d4a9" },
      auditor: { done: true, timestamp: "2025-03-17T09:15:00Z", hash: "0x9c1d...f3b8" },
      network: { done: true, timestamp: "2025-03-18T16:45:00Z", hash: "0x6e4a...c7d2" },
    },
    documentHash: "0xf4a2b8c1d3e5...7890abcdef12", validatorConfirmations: 128,
  },
  {
    id: "rOIL-003", name: "rOIL-003", type: "Oil", value: 92300, status: "Verified", backingRatio: 0.98, location: "Houston, Texas",
    verification: {
      legal: { done: true, timestamp: "2025-03-20T11:00:00Z", hash: "0x5d3c...b1a7" },
      technical: { done: true, timestamp: "2025-03-21T08:30:00Z", hash: "0x4e2b...a0c6" },
      auditor: { done: true, timestamp: "2025-03-22T13:45:00Z", hash: "0x3f1a...9fb5" },
      network: { done: true, timestamp: "2025-03-23T10:00:00Z", hash: "0x2a09...8ea4" },
    },
    documentHash: "0xa1b2c3d4e5f6...7890abcdef34", validatorConfirmations: 96,
  },
  {
    id: "rSILV-002", name: "rSILV-002", type: "Silver", value: 54200, status: "Pending", backingRatio: 0.95, location: "London, UK",
    verification: {
      legal: { done: true, timestamp: "2025-04-01T09:00:00Z", hash: "0x1b0a...7d93" },
      technical: { done: true, timestamp: "2025-04-02T14:30:00Z", hash: "0x0c9b...6e82" },
      auditor: { done: false },
      network: { done: false },
    },
    documentHash: "0xb2c3d4e5f6a7...890abcdef456", validatorConfirmations: 34,
  },
  {
    id: "rPLAT-001", name: "rPLAT-001", type: "Platinum", value: 210000, status: "Unverified", backingRatio: 0, location: "Johannesburg, SA",
    verification: { legal: { done: false }, technical: { done: false }, auditor: { done: false }, network: { done: false } },
  },
  {
    id: "rGOLD-004", name: "rGOLD-004", type: "Gold", value: 320500, status: "Verified", backingRatio: 1.05, location: "Dubai, UAE",
    verification: {
      legal: { done: true, timestamp: "2025-02-10T10:00:00Z", hash: "0xaa1b...cc2d" },
      technical: { done: true, timestamp: "2025-02-11T12:00:00Z", hash: "0xbb2c...dd3e" },
      auditor: { done: true, timestamp: "2025-02-12T14:00:00Z", hash: "0xcc3d...ee4f" },
      network: { done: true, timestamp: "2025-02-13T16:00:00Z", hash: "0xdd4e...ff5a" },
    },
    documentHash: "0xc3d4e5f6a7b8...90abcdef5678", validatorConfirmations: 156,
  },
];

export interface MarketPair {
  pair: string;
  assetId: string;
  price: number;
  change24h: number;
  volume: number;
  verified: boolean;
}

export const marketPairs: MarketPair[] = [
  { pair: "rGOLD/RS", assetId: "rGOLD-001", price: 1854.00, change24h: 2.34, volume: 12500000, verified: true },
  { pair: "rGOLD/USDT", assetId: "rGOLD-001", price: 1852.50, change24h: 2.12, volume: 8900000, verified: true },
  { pair: "rOIL/RS", assetId: "rOIL-003", price: 78.45, change24h: -1.23, volume: 5600000, verified: true },
  { pair: "rOIL/USDT", assetId: "rOIL-003", price: 78.30, change24h: -1.45, volume: 3200000, verified: true },
  { pair: "rGOLD-004/RS", assetId: "rGOLD-004", price: 1860.00, change24h: 3.10, volume: 15200000, verified: true },
];

export interface Trade {
  id: string;
  pair: string;
  side: "buy" | "sell";
  price: number;
  amount: number;
  time: string;
}

export const recentTrades: Trade[] = [
  { id: "1", pair: "rGOLD/RS", side: "buy", price: 1854.00, amount: 2.5, time: "14:32:01" },
  { id: "2", pair: "rGOLD/RS", side: "sell", price: 1853.80, amount: 1.2, time: "14:31:45" },
  { id: "3", pair: "rGOLD/RS", side: "buy", price: 1853.50, amount: 0.8, time: "14:31:22" },
  { id: "4", pair: "rGOLD/RS", side: "buy", price: 1853.20, amount: 3.1, time: "14:30:58" },
  { id: "5", pair: "rGOLD/RS", side: "sell", price: 1852.90, amount: 5.0, time: "14:30:30" },
  { id: "6", pair: "rGOLD/RS", side: "sell", price: 1852.70, amount: 1.7, time: "14:30:02" },
  { id: "7", pair: "rGOLD/RS", side: "buy", price: 1852.50, amount: 4.2, time: "14:29:45" },
  { id: "8", pair: "rGOLD/RS", side: "buy", price: 1852.30, amount: 0.5, time: "14:29:20" },
];

export const portfolioData = {
  totalValue: 862400,
  rtBalance: 45000,
  rsBalance: 128500,
  rwaValue: 688900,
  holdings: [
    { asset: "RT", amount: 45000, value: 45000, pnl: 12.5 },
    { asset: "RS", amount: 128500, value: 128500, pnl: 0.0 },
    { asset: "rGOLD-001", amount: 100, value: 185400, pnl: 8.3 },
    { asset: "rOIL-003", amount: 1000, value: 92300, pnl: -2.1 },
    { asset: "rGOLD-004", amount: 150, value: 320500, pnl: 15.7 },
  ],
};

export const stakingData = {
  rtBalance: 45000,
  stakedRT: 30000,
  mintingPower: 24000,
  collateralRatio: 1.25,
  maxRSMintable: 24000,
};

export const chartData = [
  { date: "Jan", value: 720000 },
  { date: "Feb", value: 735000 },
  { date: "Mar", value: 710000 },
  { date: "Apr", value: 780000 },
  { date: "May", value: 805000 },
  { date: "Jun", value: 790000 },
  { date: "Jul", value: 820000 },
  { date: "Aug", value: 815000 },
  { date: "Sep", value: 840000 },
  { date: "Oct", value: 830000 },
  { date: "Nov", value: 855000 },
  { date: "Dec", value: 862400 },
];

export const priceChartData = [
  { time: "09:00", price: 1845 },
  { time: "09:30", price: 1847 },
  { time: "10:00", price: 1842 },
  { time: "10:30", price: 1850 },
  { time: "11:00", price: 1848 },
  { time: "11:30", price: 1852 },
  { time: "12:00", price: 1849 },
  { time: "12:30", price: 1855 },
  { time: "13:00", price: 1851 },
  { time: "13:30", price: 1856 },
  { time: "14:00", price: 1853 },
  { time: "14:30", price: 1854 },
];
