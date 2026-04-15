import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { assets } from "@/data/mockData";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Plus, Eye } from "lucide-react";

type Tab = "all" | "Verified" | "Pending" | "submit";

const Assets = () => {
  const [tab, setTab] = useState<Tab>("all");

  const filtered = tab === "all" || tab === "submit"
    ? assets
    : assets.filter((a) => a.status === tab);

  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: "All Assets" },
    { key: "Verified", label: "Verified" },
    { key: "Pending", label: "Pending" },
    { key: "submit", label: "Submit Asset" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Assets</h1>
          <p className="text-muted-foreground mt-1">Registry & Proof of Asset</p>
        </div>
        <Link to="/assets/submit">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
            <Plus className="w-4 h-4" /> Submit Asset
          </Button>
        </Link>
      </div>

      <div className="flex gap-1 bg-muted rounded-lg p-1">
        {tabs.filter(t => t.key !== "submit").map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === t.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Asset</th>
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Value</th>
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Backing</th>
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((asset) => (
              <tr key={asset.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <td className="px-5 py-4 font-semibold text-sm text-foreground">{asset.name}</td>
                <td className="px-5 py-4 text-sm text-muted-foreground">{asset.type}</td>
                <td className="px-5 py-4 text-sm font-medium text-foreground">${asset.value.toLocaleString()}</td>
                <td className="px-5 py-4"><StatusBadge status={asset.status} /></td>
                <td className="px-5 py-4 text-sm text-muted-foreground">{asset.backingRatio > 0 ? `${(asset.backingRatio * 100).toFixed(0)}%` : "—"}</td>
                <td className="px-5 py-4">
                  <Link to={`/assets/${asset.id}`}>
                    <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
                      <Eye className="w-4 h-4" /> View
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Assets;
