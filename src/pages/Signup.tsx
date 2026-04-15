import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase, db } from "@/lib/supabase";
import { useNavigate, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email:    "",
    password: "",
    username: "",
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password || !form.username) {
      toast.error("Please fill in all fields");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      // 1. Create auth account
      const { data, error } = await supabase.auth.signUp({
        email:    form.email,
        password: form.password,
      });
      if (error) throw error;

      // 2. Create profile in users table
      if (data.user) {
        const { error: profileError } = await db.users().insert({
          auth_id:  data.user.id,
          email:    form.email,
          username: form.username,
        });
        if (profileError) throw profileError;
      }

      toast.success("Account created! Welcome to Royal Network.");
      navigate("/dashboard");

    } catch (err: any) {
      toast.error(err?.message ?? "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center"
    >
      <div className="w-full max-w-md rounded-xl bg-card border border-border p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Create account
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Join Royal Network
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">
              Username
            </label>
            <Input
              placeholder="yourname"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">
              Email
            </label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">
              Password
            </label>
            <Input
              type="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading
              ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating account...</>
              : "Create account"
            }
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Signup;