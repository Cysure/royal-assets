import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { assets } from "@/data/mockData";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, ArrowLeft, ShieldCheck, FileText, Lock } from "lucide-react";

const AssetDetail = () => {
  const { id } = useParams();
  const asset = assets.find((a) => a.id === id);

  if (!asset) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Asset not found. <Link to="/assets" className="ml-2 text-primary underline">Go back</Link>
      </div>
    );
  }

  const layers = [
    { key: "legal", label: "Legal Verification", ...asset.verification.legal },
    { key: "technical", label: "Technical Verification", ...asset.verification.technical },
    { key: "auditor", label: "Auditor Verification", ...asset.verification.auditor },
    { key: "network", label: "Network Consensus", ...asset.verification.network },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl">
      <Link to="/assets" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Assets
      </Link>

      <div className="rounded-xl bg-card border border-border p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">{asset.name}</h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              <span>{asset.type}</span>
              <span>•</span>
              <span>{asset.location}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-display font-bold text-foreground">${asset.value.toLocaleString()}</p>
            <StatusBadge status={asset.status} />
          </div>
        </div>
      </div>

      {/* Verification Layers */}
      <div className="rounded-xl bg-card border border-border p-6">
        <h2 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" /> Verification Layers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {layers.map((layer) => (
            <div key={layer.key} className={`rounded-lg border p-4 ${layer.done ? "border-emerald/30 bg-emerald/5" : "border-border bg-muted/30"}`}>
              <div className="flex items-center gap-2 mb-2">
                {layer.done ? <CheckCircle2 className="w-5 h-5 text-emerald" /> : <XCircle className="w-5 h-5 text-muted-foreground" />}
                <span className="font-semibold text-sm text-foreground">{layer.label}</span>
              </div>
              {layer.done && layer.timestamp && (
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Completed: {new Date(layer.timestamp).toLocaleDateString()}</p>
                  {layer.hash && <p className="font-mono truncate">Sig: {layer.hash}</p>}
                </div>
              )}
              {!layer.done && <p className="text-xs text-muted-foreground">Awaiting verification</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Proof Section */}
      {asset.documentHash && (
        <div className="rounded-xl bg-card border border-border p-6">
          <h2 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> Proof of Asset
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Document Hash</span>
              <span className="text-sm font-mono text-foreground truncate max-w-xs">{asset.documentHash}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Validator Confirmations</span>
              <span className="text-sm font-semibold text-foreground">{asset.validatorConfirmations}</span>
            </div>
            <div className="flex items-center gap-2 text-emerald text-sm font-medium">
              <Lock className="w-4 h-4" /> Tamper-proof secured
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      {asset.status === "Verified" && (
        <div className="flex gap-3">
          <Link to={`/trade?pair=${asset.name}/RS`}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Trade Asset</Button>
          </Link>
          <Link to="/markets">
            <Button variant="outline">View Market Pair</Button>
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default AssetDetail;
