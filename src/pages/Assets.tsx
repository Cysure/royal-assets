import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { db } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Loader2 } from "lucide-react";

type Tab = "all" | "pending" | "verified" | "listed";

const STATUS_COLORS: Record<string, string> = {
  pending:  "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20",
  verified: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-600 border border-red-500/20",
  listed:   "bg-blue-500/10 text-blue-600 border border-blue-500/20",
};

const Assets = () => {
  const [tab,     setTab]     = useState<Tab>("all");
  const [assets,  setAssets]  = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      try {
        let query = db.assets()
          .select("id, name, asset_type, valuation_usd, status, location, created_at")
          .order("created_at", { ascending: false });

        if (tab !== "all") {
          query = query.eq("status", tab);
        }

        const { data, error } = await query;
        if (error) throw error;
        setAssets(data ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [tab]);

  const tabs: { key: Tab; label: string }[] = [
    { key: "all",      label: "All Assets" },
    { key: "verified", label: "Verified"   },
    { key: "pending",  label: "Pending"    },
    { key: "listed",   label: "Listed"     },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-7xl"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Assets
          </h1>
          <p className="text-muted-foreground mt-1">Registry & Proof of Asset</p>
        </div>
        <Link to="/assets/submit">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Plus className="w-4 h-4" /> Submit Asset
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-lg p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl bg-card border border-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : assets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-3">
            <p className="text-sm">No assets found</p>
            <Link to="/assets/submit">
              <Button size="sm" className="bg-primary text-primary-foreground">
                Submit your first asset
              </Button>
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Asset</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Location</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Value</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr
                  key={asset.id}
                  className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                >
                  <td className="px-5 py-4 font-semibold text-sm text-foreground">
                    {asset.name}
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground capitalize">
                    {asset.asset_type?.replace("_", " ")}
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">
                    {asset.location ?? "—"}
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-foreground">
                    {asset.valuation_usd
                      ? `$${Number(asset.valuation_usd).toLocaleString()}`
                      : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                      STATUS_COLORS[asset.status] ?? STATUS_COLORS.pending
                    }`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <Link to={`/assets/${asset.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-muted-foreground hover:text-foreground"
                      >
                        <Eye className="w-4 h-4" /> View
                      </Button>
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

export default Assets;