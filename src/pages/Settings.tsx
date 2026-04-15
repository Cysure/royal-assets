import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-display font-bold text-foreground">Settings</h1>

      <div className="rounded-xl bg-card border border-border p-6 space-y-6">
        <div>
          <h2 className="font-display font-semibold text-lg text-foreground mb-1">Appearance</h2>
          <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => theme !== "light" && toggleTheme()}
            className={`flex-1 rounded-xl border-2 p-6 transition-all ${
              theme === "light" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
            }`}
          >
            <Sun className={`w-8 h-8 mx-auto mb-2 ${theme === "light" ? "text-primary" : "text-muted-foreground"}`} />
            <p className="text-sm font-semibold text-foreground">Light</p>
          </button>
          <button
            onClick={() => theme !== "dark" && toggleTheme()}
            className={`flex-1 rounded-xl border-2 p-6 transition-all ${
              theme === "dark" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
            }`}
          >
            <Moon className={`w-8 h-8 mx-auto mb-2 ${theme === "dark" ? "text-primary" : "text-muted-foreground"}`} />
            <p className="text-sm font-semibold text-foreground">Dark</p>
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-card border border-border p-6 space-y-4">
        <div>
          <h2 className="font-display font-semibold text-lg text-foreground mb-1">Wallet</h2>
          <p className="text-sm text-muted-foreground">Manage your connected wallet</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Connect Wallet</Button>
      </div>

      <div className="rounded-xl bg-card border border-border p-6 space-y-4">
        <div>
          <h2 className="font-display font-semibold text-lg text-foreground mb-1">Notifications</h2>
          <p className="text-sm text-muted-foreground">Configure your notification preferences</p>
        </div>
        <div className="space-y-3">
          {["Trade confirmations", "Asset verification updates", "Price alerts"].map((n) => (
            <div key={n} className="flex items-center justify-between py-2">
              <span className="text-sm text-foreground">{n}</span>
              <div className="w-10 h-6 rounded-full bg-primary/20 relative cursor-pointer">
                <div className="w-4 h-4 rounded-full bg-primary absolute top-1 right-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
