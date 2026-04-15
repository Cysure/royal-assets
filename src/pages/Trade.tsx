import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { db } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, TrendingUp, BarChart3, ArrowUpDown, Loader2 } from "lucide-react";

const TradePage = () => {
  const [searchParams] = useSearchParams();
  const assetParam = searchParams.get("asset") || "";

  const [assets,       setAssets]       = useState<any[]>([]);
  const [selectedId,   setSelectedId]   = useState(assetParam);
  const [currentAsset, setCurrentAsset] = useState<any>(null);
  const [loading,      setLoading]      = useState(true);
  const [side,         setSide]         = useState<"buy" | "sell">("buy");
  const [orderType,    setOrderType]    = useState<"market" | "limit">("market");
  const [amount,       setAmount]       = useState("");
  const [limitPrice,   setLimitPrice]   = useState("");

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      const { data } = await db.assets()
        .select("id, name, asset_type, valuation_usd, status, location")
        .in("status", ["verified", "listed"])
        .order("created_at", { ascending: false });
      const list = data ?? [];
      setAssets(list);
      if (list.length > 0) {
        const found = assetParam ? list.find((a: any) => a.id === assetParam) : list[0];
        const selected = found ?? list[0];
        setSelectedId(selected.id);
        setCurrentAsset(selected);
      }
      setLoading(false);
    };
    fetchAssets();
  }, []);

  const handleSelectAsset = (id: string) => {
    setSelectedId(id);
    setCurrentAsset(assets.find((a) => a.id === id) ?? null);
  };

  const handlePlaceOrder = () => {
    if (!amount) { alert("Enter an amount"); return; }
    alert("Order placed (UI only — blockchain integration coming in Phase 8)");
    setAmount("");
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
    </div>
  );

  if (assets.length === 0) return (
    <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
      No verified assets available to trade yet.
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 max-w-7xl">

      <div className="flex items-center gap-6 flex-wrap">
        <select
          value={selectedId}
          onChange={(e) => handleSelectAsset(e.target.value)}
          className="bg-card border border-border rounded-lg px-3 py-2 text-sm font-semibold text-foreground"
        >
          {assets.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>

        {currentAsset && (
          <>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">
                {currentAsset.valuation_usd ? "$" + Number(currentAsset.valuation_usd).toLocaleString() : "—"}
              </p>
              <p className="text-xs text-muted-foreground capitalize">{currentAsset.asset_type?.replace("_", " ")} • {currentAsset.location ?? ""}</p>
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-emerald-500">
              <TrendingUp className="w-4 h-4" /> Listed
            </div>
            <span className="inline-flex items-center gap-1 text-emerald-500 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified
            </span>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <div className="lg:col-span-2 rounded-xl bg-card border border-border p-6">
          <h2 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" /> Price Chart
          </h2>
          <div className="h-64 flex items-center justify-center text-muted-foreground text-sm border border-dashed border-border rounded-lg">
            Live chart will connect to market data in Phase 8
          </div>
        </div>

        <div className="rounded-xl bg-card border border-border p-5 space-y-4">
          <div className="flex rounded-lg overflow-hidden border border-border">
            <button
              onClick={() => setSide("buy")}
              className={"flex-1 py-2.5 text-sm font-semibold transition-colors " + (side === "buy" ? "bg-emerald-500 text-white" : "bg-card text-muted-foreground hover:text-foreground")}
            >
              Buy
            </button>
            <button
              onClick={() => setSide("sell")}
              className={"flex-1 py-2.5 text-sm font-semibold transition-colors " + (side === "sell" ? "bg-red-500 text-white" : "bg-card text-muted-foreground hover:text-foreground")}
            >
              Sell
            </button>
          </div>

          <div className="flex gap-1 bg-muted rounded-md p-1">
            <button
              onClick={() => setOrderType("market")}
              className={"flex-1 py-1.5 text-xs font-medium rounded transition-colors " + (orderType === "market" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground")}
            >
              Market
            </button>
            <button
              onClick={() => setOrderType("limit")}
              className={"flex-1 py-1.5 text-xs font-medium rounded transition-colors " + (orderType === "limit" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground")}
            >
              Limit
            </button>
          </div>

          {orderType === "limit" && (
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Limit Price</label>
              <Input type="number" placeholder="0.00" value={limitPrice} onChange={(e) => setLimitPrice(e.target.value)} />
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Amount</label>
            <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Asset</span>
            <span>{currentAsset?.name ?? "—"}</span>
          </div>

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Order type</span>
            <span className="capitalize">{orderType}</span>
          </div>

          <Button
            onClick={handlePlaceOrder}
            className={"w-full font-semibold " + (side === "buy" ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-red-500 hover:bg-red-600 text-white")}
          >
            {side === "buy" ? "Buy" : "Sell"} {currentAsset?.name ?? ""}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            UI only — no blockchain execution yet
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-card border border-border p-5">
        <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-primary" /> Recent Trades
        </h3>
        <div className="grid grid-cols-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2 border-b border-border">
          <span>Price</span><span>Amount</span><span>Side</span><span>Time</span>
        </div>
        <div className="flex items-center justify-center h-20 text-muted-foreground text-sm">
          No trades yet
        </div>
      </div>

    </motion.div>
  );
};

export default TradePage;
