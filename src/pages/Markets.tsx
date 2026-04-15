import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { ShieldCheck, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const Markets = () => {
  const [assets,  setAssets]  = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      const { data, error } = await db.assets()
        .select("id, name, asset_type, valuation_usd, status, location, created_at")
        .in("status", ["verified", "listed"])
        .order("created_at", { ascending: false });
      if (!error) setAssets(data ?? []);
      setLoading(false);
    };
    fetchAssets();
  }, []);

  const filtered = assets.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Markets</h1>
        <p className="text-muted-foreground mt-1">Verified real-world assets available for trading</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search assets..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="rounded-xl bg-card border border-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm gap-2">
            <p>No verified assets listed yet</p>
            <p className="text-xs">Assets must be verified and listed by an admin first</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Asset</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Location</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Valuation</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((asset) => (
                <tr key={asset.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-5 py-4 font-semibold text-sm text-foreground">{asset.name}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground capitalize">{asset.asset_type?.replace("_", " ")}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{asset.location ?? "—"}</td>
                  <td className="px-5 py-4 text-sm font-medium text-foreground">
                    {asset.valuation_usd ? "$" + Number(asset.valuation_usd).toLocaleString() : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 text-emerald-500 text-xs font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" /> {asset.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <Link to={"/trade?asset=" + asset.id} className="text-xs text-primary hover:underline font-medium">
                      Trade
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
};

export default Markets;
