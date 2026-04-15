import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Upload, Check, Loader2, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase, db } from "@/lib/supabase";

const ASSET_TYPES = [
  { value: "real_estate", label: "Real Estate" },
  { value: "commodity",   label: "Commodity"   },
  { value: "equity",      label: "Equity"       },
  { value: "bond",        label: "Bond"         },
  { value: "fund",        label: "Fund"         },
  { value: "other",       label: "Other"        },
];

const DOC_SLOTS = [
  { key: "ownership",  label: "Ownership Proof"   },
  { key: "geological", label: "Geological Report" },
  { key: "audit",      label: "Audit Report"      },
];

const SubmitAsset = () => {
  const [step, setStep]       = useState(1);
  const [loading, setLoading] = useState(false);
  const [assetId, setAssetId] = useState<string | null>(null);
  const navigate              = useNavigate();

  const [form, setForm] = useState({
    name:        "",
    type:        "commodity",
    location:    "",
    value:       "",
    description: "",
  });

  // Track uploaded files per slot
  const [files, setFiles] = useState<Record<string, File | null>>({
    ownership:  null,
    geological: null,
    audit:      null,
  });

  const [uploading, setUploading] = useState<Record<string, boolean>>({
    ownership:  false,
    geological: false,
    audit:      false,
  });

  // ── Step 1 → Step 2: save asset first ──
  const handleContinueToDocuments = async () => {
    if (!form.name)     { toast.error("Asset name is required");  return; }
    if (!form.location) { toast.error("Location is required");    return; }
    if (!form.value)    { toast.error("Value is required");       return; }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error("Please log in first"); navigate("/login"); return; }

      const { data: profile } = await db.users()
        .select("id")
        .eq("auth_id", user.id)
        .single();

      if (!profile) { toast.error("Profile not found"); return; }

      const { data: asset, error } = await db.assets()
        .insert({
          owner_id:       profile.id,
          name:           form.name,
          asset_type:     form.type as any,
          location:       form.location,
          description:    form.description || null,
          valuation_usd:  parseFloat(form.value),
          status:         "pending",
          asset_metadata: {},
        })
        .select("id")
        .single();

      if (error) throw error;

      setAssetId(asset.id);
      setStep(2);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to save asset");
    } finally {
      setLoading(false);
    }
  };

  // ── Upload a single file ──
  const handleFileUpload = async (slotKey: string, file: File) => {
    if (!assetId) return;

    setUploading(prev => ({ ...prev, [slotKey]: true }));
    try {
      // 1. Upload to Supabase Storage
      const path = `${assetId}/${slotKey}-${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("asset-docs")
        .upload(path, file);

      if (uploadError) throw uploadError;

      // 2. Get public URL
      const { data: urlData } = supabase.storage
        .from("asset-docs")
        .getPublicUrl(path);

      // 3. Save metadata to documents table
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile }  = await db.users()
        .select("id").eq("auth_id", user!.id).single();

      await db.documents().insert({
        asset_id:        assetId,
        uploaded_by:     profile!.id,
        doc_type:        "other",
        file_name:       file.name,
        file_url:        urlData.publicUrl,
        file_size_bytes: file.size,
        mime_type:       file.type,
        is_public:       false,
        doc_metadata:    { slot: slotKey },
      });

      setFiles(prev => ({ ...prev, [slotKey]: file }));
      toast.success(`${file.name} uploaded`);
    } catch (err: any) {
      toast.error(err?.message ?? "Upload failed");
    } finally {
      setUploading(prev => ({ ...prev, [slotKey]: false }));
    }
  };

  // ── Final submit ──
  const handleSubmit = async () => {
    toast.success("Asset submitted for verification!");
    navigate("/assets");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-2xl"
    >
      <Link
        to="/assets"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Assets
      </Link>

      <h1 className="text-3xl font-display font-bold text-foreground">
        Submit New Asset
      </h1>

      {/* Steps indicator */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              step >= s
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}>
              {step > s ? <Check className="w-4 h-4" /> : s}
            </div>
            {s < 3 && (
              <div className={`w-12 h-0.5 ${step > s ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-card border border-border p-6">

        {/* Step 1 — Asset Info */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-display font-semibold text-lg text-foreground">
              Asset Information
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Asset Name *</label>
                <Input
                  placeholder="e.g. rGOLD-005"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Asset Type *</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm"
                >
                  {ASSET_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Location *</label>
                <Input
                  placeholder="e.g. Zurich, Switzerland"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Estimated Value (USD) *</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Description</label>
                <Input
                  placeholder="Brief description..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </div>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleContinueToDocuments}
              disabled={loading}
            >
              {loading
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
                : "Continue"
              }
            </Button>
          </div>
        )}

        {/* Step 2 — Document Upload */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-display font-semibold text-lg text-foreground">
              Upload Documents
            </h2>
            {DOC_SLOTS.map((slot) => (
              <div key={slot.key}>
                <label className="text-sm font-medium text-foreground block mb-2">
                  {slot.label}
                </label>
                {files[slot.key] ? (
                  <div className="border border-border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-foreground">
                        {files[slot.key]!.name}
                      </span>
                    </div>
                    <button
                      onClick={() => setFiles(prev => ({ ...prev, [slot.key]: null }))}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer block">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(slot.key, file);
                      }}
                    />
                    {uploading[slot.key] ? (
                      <Loader2 className="w-8 h-8 mx-auto text-muted-foreground animate-spin mb-2" />
                    ) : (
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    )}
                    <p className="text-sm font-medium text-foreground">
                      {uploading[slot.key] ? "Uploading..." : "Click to upload"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, JPG, PNG (max 10MB)
                    </p>
                  </label>
                )}
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => setStep(3)}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3 — Review & Submit */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-display font-semibold text-lg text-foreground">
              Review & Submit
            </h2>
            <div className="space-y-2 text-sm">
              {[
                { label: "Name",      value: form.name },
                { label: "Type",      value: form.type },
                { label: "Location",  value: form.location },
                { label: "Value",     value: `$${Number(form.value || 0).toLocaleString()}` },
                { label: "Documents", value: `${Object.values(files).filter(Boolean).length} uploaded` },
                { label: "Status",    value: "Pending verification" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-foreground font-medium">{value || "—"}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading
                  ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</>
                  : "Submit for Verification"
                }
              </Button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SubmitAsset;