import { useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { marketPairs, recentTrades, priceChartData } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, TrendingUp, TrendingDown, BarChart3, ArrowUpDown } from "lucide-react";

const TradePage = () => {
  const [searchParams] = useSearchParams();
  const pairParam = searchParams.get("pair") || "rGOLD/RS";
  const [selectedPair, setSelectedPair] = useState(pairParam);
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [amount, setAmount] = useState("");
  const [limitPrice, setLimitPrice] = useState("");

  const currentPair = marketPairs.find((p) => p.pair === selectedPair) || marketPairs[0];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 max-w-7xl">
      {/* Top stats bar */}
      <div className="flex items-center gap-6 flex-wrap">
        <select
          value={selectedPair}
          onChange={(e) => setSelectedPair(e.target.value)}
          className="bg-card border border-border rounded-lg px-3 py-2 text-sm font-semibold text-foreground"
        >
          {marketPairs.map((p) => (
            <option key={p.pair} value={p.pair}>{p.pair}</option>
          ))}
        </select>
        <div>
          <p className="text-2xl font-display font-bold text-foreground">${currentPair.price.toLocaleString()}</p>
        </div>
        <div className={`flex items-center gap-1 text-sm font-semibold ${currentPair.change24h >= 0 ? "text-emerald" : "text-destructive"}`}>
          {currentPair.change24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {currentPair.change24h >= 0 ? "+" : ""}{currentPair.change24h}%
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          <BarChart3 className="w-4 h-4" /> Vol: ${(currentPair.volume / 1e6).toFixed(1)}M
        </div>
        {currentPair.verified && (
          <span className="inline-flex items-center gap-1 text-emerald text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart */}
        <div className="lg:col-span-2 rounded-xl bg-card border border-border p-6">
          <h2 className="font-display font-semibold text-foreground mb-4">Price Chart</h2>
          <div className="h-64 flex items-end gap-1">
            {priceChartData.map((d, i) => {
              const max = Math.max(...priceChartData.map(c => c.price));
              const min = Math.min(...priceChartData.map(c => c.price));
              const range = max - min || 1;
              const h = ((d.price - min) / range) * 100 + 10;
              const isUp = i > 0 && d.price >= priceChartData[i - 1].price;
              return (
                <motion.div
                  key={d.time}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                  className={`flex-1 rounded-t-sm transition-colors cursor-pointer group relative ${
                    isUp || i === 0 ? "bg-emerald/30 hover:bg-emerald/50" : "bg-destructive/30 hover:bg-destructive/50"
                  }`}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-card border border-border rounded px-2 py-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-foreground">
                    ${d.price}
                  </div>
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground">{d.time}</div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Order Panel */}
        <div className="rounded-xl bg-card border border-border p-5 space-y-4">
          <div className="flex rounded-lg overflow-hidden border border-border">
            <button
              onClick={() => setSide("buy")}
              className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                side === "buy" ? "bg-emerald text-emerald-foreground" : "bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setSide("sell")}
              className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                side === "sell" ? "bg-destructive text-destructive-foreground" : "bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              Sell
            </button>
          </div>

          <div className="flex gap-1 bg-muted rounded-md p-1">
            <button
              onClick={() => setOrderType("market")}
              className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${
                orderType === "market" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Market
            </button>
            <button
              onClick={() => setOrderType("limit")}
              className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${
                orderType === "limit" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Limit
            </button>
          </div>

          {orderType === "limit" && (
            <div>
              <label className="text-xs font-medium text-muted-foreground">Limit Price</label>
              <Input
                type="number"
                placeholder="0.00"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-muted-foreground">Amount</label>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Available</span>
            <span>128,500.00 RS</span>
          </div>

          <Button className={`w-full font-semibold ${
            side === "buy" ? "bg-emerald text-emerald-foreground hover:bg-emerald/90" : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
          }`}>
            {side === "buy" ? "Buy" : "Sell"} {selectedPair.split("/")[0]}
          </Button>
        </div>
      </div>

      {/* Recent Trades */}
      <div className="rounded-xl bg-card border border-border p-5">
        <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-primary" /> Recent Trades
        </h3>
        <div className="grid grid-cols-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2 border-b border-border">
          <span>Price</span><span>Amount</span><span>Side</span><span>Time</span>
        </div>
        {recentTrades.map((t) => (
          <div key={t.id} className="grid grid-cols-4 text-sm py-2 border-b border-border last:border-0">
            <span className={t.side === "buy" ? "text-emerald" : "text-destructive"}>${t.price.toLocaleString()}</span>
            <span className="text-foreground">{t.amount}</span>
            <span className={`capitalize font-medium ${t.side === "buy" ? "text-emerald" : "text-destructive"}`}>{t.side}</span>
            <span className="text-muted-foreground">{t.time}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default TradePage;
