import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { db } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck, FileText, Lock, Loader2, XCircle } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  pending:  "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  verified: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-600 border-red-500/20",
  listed:   "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

const LAYERS = [
  { key: "legal",     label: "Legal Verification"     },
  { key: "technical", label: "Technical Verification"  },
  { key: "auditor",   label: "Auditor Verification"    },
  { key: "network",   label: "Network Consensus"       },
];

const AssetDetail = () => {
  const { id } = useParams();
  const [asset,     setAsset]     = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: e } = await db.assets().select("*").eq("id", id).single();
        if (e) throw e;
        setAsset(data);
        const { data: docs } = await db.documents().select("*").eq("asset_id", id);
        setDocuments(docs ?? []);
      } catch (err: any) {
        setError(err?.message ?? "Not found");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  if (error || !asset) return <div className="flex items-center justify-center h-64 text-muted-foreground">Asset not found. <Link to="/assets" className="ml-2 text-primary underline">Go back</Link></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl">
      <Link to="/assets" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Assets
      </Link>

      <div className="rounded-xl bg-card border border-border p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">{asset.name}</h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              <span className="capitalize">{asset.asset_type?.replace("_", " ")}</span>
              {asset.location && <><span>•</span><span>{asset.location}</span></>}
            </div>
            {asset.description && <p className="mt-3 text-sm text-muted-foreground">{asset.description}</p>}
          </div>
          <div className="text-right space-y-2">
            {asset.valuation_usd && <p className="text-2xl font-display font-bold text-foreground">${Number(asset.valuation_usd).toLocaleString()}</p>}
            <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border capitalize ${STATUS_COLORS[asset.status] ?? STATUS_COLORS.pending}`}>{asset.status}</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-card border border-border p-6">
        <h2 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" /> Verification Layers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LAYERS.map((layer) => (
            <div key={layer.key} className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-5 h-5 text-muted-foreground" />
                <span className="font-semibold text-sm text-foreground">{layer.label}</span>
              </div>
              <p className="text-xs text-muted-foreground">Awaiting verification</p>
            </div>
          ))}
        </div>
      </div>

      {documents.length > 0 && (
        <div className="rounded-xl bg-card border border-border p-6">
          <h2 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> Documents
          </h2>
          <div className="space-y-2">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{doc.file_name}</p>
                  <p className="text-xs text-muted-foreground">{doc.mime_type}</p>
                </div>
                <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">View</a>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 text-emerald-500 text-sm font-medium mt-4">
            <Lock className="w-4 h-4" /> Secured in Supabase Storage
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AssetDetail;
