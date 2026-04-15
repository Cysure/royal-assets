import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Upload, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SubmitAsset = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", type: "", location: "", value: "" });

  const handleSubmit = () => {
    toast.success("Asset submitted for verification!");
    navigate("/assets");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
      <Link to="/assets" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Assets
      </Link>

      <h1 className="text-3xl font-display font-bold text-foreground">Submit New Asset</h1>

      {/* Steps indicator */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              {step > s ? <Check className="w-4 h-4" /> : s}
            </div>
            {s < 3 && <div className={`w-12 h-0.5 ${step > s ? "bg-primary" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-card border border-border p-6">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-display font-semibold text-lg text-foreground">Asset Information</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Asset Name</label>
                <Input placeholder="e.g. rGOLD-005" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Type</label>
                <Input placeholder="e.g. Gold, Oil, Silver" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Location</label>
                <Input placeholder="e.g. Zurich, Switzerland" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Estimated Value (USD)</label>
                <Input type="number" placeholder="0.00" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
              </div>
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setStep(2)}>Continue</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-display font-semibold text-lg text-foreground">Upload Documents</h2>
            {["Ownership Proof", "Geological Report", "Audit Report"].map((doc) => (
              <div key={doc} className="border border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-medium text-foreground">{doc}</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG (max 10MB)</p>
              </div>
            ))}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setStep(3)}>Continue</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-display font-semibold text-lg text-foreground">Review & Submit</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Name</span><span className="text-foreground font-medium">{form.name || "—"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Type</span><span className="text-foreground font-medium">{form.type || "—"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Location</span><span className="text-foreground font-medium">{form.location || "—"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Value</span><span className="text-foreground font-medium">${Number(form.value || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Documents</span><span className="text-foreground font-medium">3 uploaded</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleSubmit}>Submit for Verification</Button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SubmitAsset;
