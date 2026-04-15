import { useState } from "react";
import { motion } from "framer-motion";
import { stakingData } from "@/data/mockData";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Coins, Lock, Zap, Percent } from "lucide-react";
import { toast } from "sonner";

const StakeRT = () => {
  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const fmt = (n: number) => n.toLocaleString();

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-display font-bold text-foreground">Stake RT</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="RT Balance" value={fmt(stakingData.rtBalance)} icon={<Coins className="w-5 h-5" />} />
        <StatCard title="Staked RT" value={fmt(stakingData.stakedRT)} icon={<Lock className="w-5 h-5" />} />
        <StatCard title="Minting Power" value={`${fmt(stakingData.mintingPower)} RS`} icon={<Zap className="w-5 h-5" />} />
        <StatCard title="Collateral Ratio" value={`${stakingData.collateralRatio}x`} icon={<Percent className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl bg-card border border-border p-6 space-y-4">
          <h2 className="font-display font-semibold text-lg text-foreground">Stake RT</h2>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Amount to Stake</label>
            <Input type="number" placeholder="0" value={stakeAmount} onChange={(e) => setStakeAmount(e.target.value)} />
            <p className="text-xs text-muted-foreground mt-1">Available: {fmt(stakingData.rtBalance - stakingData.stakedRT)} RT</p>
          </div>
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => { toast.success(`Staked ${stakeAmount} RT`); setStakeAmount(""); }}>
            Stake RT
          </Button>
        </div>

        <div className="rounded-xl bg-card border border-border p-6 space-y-4">
          <h2 className="font-display font-semibold text-lg text-foreground">Unstake RT</h2>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Amount to Unstake</label>
            <Input type="number" placeholder="0" value={unstakeAmount} onChange={(e) => setUnstakeAmount(e.target.value)} />
            <p className="text-xs text-muted-foreground mt-1">Staked: {fmt(stakingData.stakedRT)} RT</p>
          </div>
          <Button variant="outline" className="w-full" onClick={() => { toast.success(`Unstaked ${unstakeAmount} RT`); setUnstakeAmount(""); }}>
            Unstake RT
          </Button>
        </div>
      </div>

      <div className="rounded-xl bg-card border border-border p-6">
        <h2 className="font-display font-semibold text-lg text-foreground mb-3">Staking Details</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Collateral Ratio</span>
            <span className="text-foreground font-medium">{stakingData.collateralRatio}x</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Max RS Mintable</span>
            <span className="text-foreground font-medium">{fmt(stakingData.maxRSMintable)} RS</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Current Minting Power</span>
            <span className="text-primary font-semibold">{fmt(stakingData.mintingPower)} RS</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StakeRT;
