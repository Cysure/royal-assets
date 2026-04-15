import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Upload, Check, Loader2 } from "lucide-react";
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

const SubmitAsset = () => {
  const [step, setStep]       = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate              = useNavigate();
  const [form, setForm]       = useState({
    name:        "",
    type:        "commodity",
    location:    "",
    value:       "",
    description: "",
  });

  const handleSubmit = async () => {
    if (!form.name)     { toast.error("Asset name is required");  return; }
    if (!form.location) { toast.error("Location is required");    return; }
    if (!form.value)    { toast.error("Value is required");       return; }

    setLoading(true);

    try {
      // 1. Get current logged in user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to submit an asset");
        navigate("/login");
        return;
      }

      // 2. Get their profile from users table
      const { data: profile, error: profileError } = await db.users()
        .select("id")
        .eq("auth_id", user.id)
        .single();

      if (profileError || !profile) {
        toast.error("Could not find your profile");
        return;
      }

      // 3. Insert asset with owner_id
      const { data: asset, error: assetError } = await db.assets()
        .insert({
          owner_id:      profile.id,
          name:          form.name,
          asset_type:    form.type as any,
          location:      form.location,
          description:   form.description || null,
          valuation_usd: parseFloat(form.value),
          status:        "pending",
          asset_metadata: {},
        })
        .select("id")
        .single();

      if (assetError) throw assetError;

      toast.success("Asset submitted for verification!");
      navigate("/assets");

    } catch (err: any) {
      toast.error(err?.message ?? "Failed to submit asset");
    } finally {
      setLoading(false);
    }
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
                <label className="text-sm font-medium text-foreground block mb-1">
                  Asset Name *
                </label>
                <Input
                  placeholder="e.g. rGOLD-005"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">
                  Asset Type *
                </label>
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
                <label className="text-sm font-medium text-foreground block mb-1">
                  Location *
                </label>
                <Input
                  placeholder="e.g. Zurich, Switzerland"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">
                  Estimated Value (USD) *
                </label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">
                  Description
                </label>
                <Input
                  placeholder="Brief description..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </div>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setStep(2)}
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 2 — Documents (UI only for now) */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-display font-semibold text-lg text-foreground">
              Upload Documents
            </h2>
            {["Ownership Proof", "Geological Report", "Audit Report"].map((doc) => (
              <div
                key={doc}
                className="border border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
              >
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-medium text-foreground">{doc}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, JPG, PNG (max 10MB)
                </p>
              </div>
            ))}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
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
                { label: "Name",     value: form.name },
                { label: "Type",     value: form.type },
                { label: "Location", value: form.location },
                { label: "Value",    value: `$${Number(form.value || 0).toLocaleString()}` },
                { label: "Status",   value: "Pending verification" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between py-2 border-b border-border"
                >
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-foreground font-medium">{value || "—"}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
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