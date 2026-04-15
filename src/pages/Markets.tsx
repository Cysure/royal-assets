import { useState } from "react";
import { motion } from "framer-motion";
import { marketPairs } from "@/data/mockData";
import { Link } from "react-router-dom";
import { ShieldCheck, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Markets = () => {
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = marketPairs
    .filter((p) => !verifiedOnly || p.verified)
    .filter((p) => p.pair.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl">
      <h1 className="text-3xl font-display font-bold text-foreground">Markets</h1>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search pairs..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setVerifiedOnly(!verifiedOnly)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
            verifiedOnly ? "bg-emerald/10 text-emerald border-emerald/30" : "bg-card text-muted-foreground border-border hover:text-foreground"
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Verified Only
        </button>
      </div>

      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pair</th>
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price</th>
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">24h Change</th>
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Volume</th>
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((pair) => (
              <Link
                key={pair.pair}
                to={`/trade?pair=${encodeURIComponent(pair.pair)}`}
                className="contents"
              >
                <tr className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer">
                  <td className="px-5 py-4 font-semibold text-sm text-foreground">{pair.pair}</td>
                  <td className="px-5 py-4 text-sm font-medium text-foreground">${pair.price.toLocaleString()}</td>
                  <td className={`px-5 py-4 text-sm font-semibold ${pair.change24h >= 0 ? "text-emerald" : "text-destructive"}`}>
                    {pair.change24h >= 0 ? "+" : ""}{pair.change24h}%
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">${(pair.volume / 1e6).toFixed(1)}M</td>
                  <td className="px-5 py-4">
                    {pair.verified && (
                      <span className="inline-flex items-center gap-1 text-emerald text-xs font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                  </td>
                </tr>
              </Link>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Markets;
