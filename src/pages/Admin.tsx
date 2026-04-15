import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const STATUS_COLORS: Record<string, string> = {
  pending:  "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  verified: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-600 border-red-500/20",
  listed:   "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

const LAYERS = ["legal", "technical", "auditor"];

const Admin = () => {
  const [assets,  setAssets]  = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssets = async () => {
    setLoading(true);
    const { data, error } = await db.assets()
      .select("id, name, asset_type, valuation_usd, status, location, created_at")
      .order("created_at", { ascending: false });
    if (!error) setAssets(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchAssets(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await db.assets().update({ status }).eq("id", id);
    if (error) { toast.error(error.message); } else { toast.success("Asset updated"); fetchAssets(); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-2">
          <ShieldCheck className="w-7 h-7 text-primary" /> Admin Panel
        </h1>
        <p className="text-muted-foreground mt-1">Review and verify submitted assets</p>
      </div>

      <div className="rounded-xl bg-card border border-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Asset</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Type</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Value</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="px-5 py-4">
                    <Link to={"/assets/" + asset.id} className="font-semibold text-sm text-foreground hover:text-primary">
                      {asset.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{asset.location ?? ""}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground capitalize">{asset.asset_type?.replace("_", " ")}</td>
                  <td className="px-5 py-4 text-sm font-medium text-foreground">{asset.valuation_usd ? "$" + Number(asset.valuation_usd).toLocaleString() : "—"}</td>
                  <td className="px-5 py-4">
                    <span className={"text-xs font-semibold px-2 py-1 rounded-full border capitalize " + (STATUS_COLORS[asset.status] ?? STATUS_COLORS.pending)}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {asset.status === "pending" && (
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1" onClick={() => updateStatus(asset.id, "verified")}>
                          <CheckCircle2 className="w-3 h-3" /> Verify
                        </Button>
                      )}
                      {asset.status === "verified" && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => updateStatus(asset.id, "listed")}>
                          List
                        </Button>
                      )}
                      {asset.status !== "rejected" && (
                        <Button size="sm" variant="outline" className="text-red-500 border-red-500/30 hover:bg-red-500/10 gap-1" onClick={() => updateStatus(asset.id, "rejected")}>
                          <XCircle className="w-3 h-3" /> Reject
                        </Button>
                      )}
                    </div>
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

export default Admin;
