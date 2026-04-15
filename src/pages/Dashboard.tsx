import { motion } from "framer-motion";
import StatCard from "@/components/StatCard";
import { portfolioData, chartData } from "@/data/mockData";
import { TrendingUp, Coins, DollarSign, Package, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const fmt = (n: number) => "$" + n.toLocaleString();

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back to Royal Network</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Portfolio" value={fmt(portfolioData.totalValue)} trend={12.5} icon={<TrendingUp className="w-5 h-5" />} />
        <StatCard title="RT Balance" value={fmt(portfolioData.rtBalance)} icon={<Coins className="w-5 h-5" />} />
        <StatCard title="RS Balance" value={fmt(portfolioData.rsBalance)} icon={<DollarSign className="w-5 h-5" />} />
        <StatCard title="RWA Holdings" value={fmt(portfolioData.rwaValue)} trend={8.3} icon={<Package className="w-5 h-5" />} />
      </div>

      {/* Chart */}
      <div className="rounded-xl bg-card border border-border p-6">
        <h2 className="font-display font-semibold text-lg text-foreground mb-4">Performance</h2>
        <div className="h-48 flex items-end gap-1">
          {chartData.map((d, i) => {
            const max = Math.max(...chartData.map(c => c.value));
            const min = Math.min(...chartData.map(c => c.value));
            const h = ((d.value - min) / (max - min)) * 100 + 20;
            return (
              <motion.div
                key={d.date}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t-md transition-colors relative group cursor-pointer"
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-card border border-border rounded px-2 py-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {fmt(d.value)}
                </div>
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground">{d.date}</div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Quick actions + activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-xl bg-card border border-border p-5 space-y-3">
          <h3 className="font-display font-semibold text-foreground">Quick Actions</h3>
          <Link to="/stake">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 justify-between">
              Stake RT <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/stake">
            <Button variant="outline" className="w-full justify-between mt-2">
              Mint RS <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="lg:col-span-2 rounded-xl bg-card border border-border p-5">
          <h3 className="font-display font-semibold text-foreground mb-3">Recent Activity</h3>
          <div className="space-y-2">
            {[
              { action: "Staked 5,000 RT", time: "2 hours ago", color: "text-primary" },
              { action: "Traded 2.5 rGOLD → RS", time: "5 hours ago", color: "text-emerald" },
              { action: "Asset rSILV-002 submitted", time: "1 day ago", color: "text-muted-foreground" },
              { action: "Minted 12,000 RS", time: "2 days ago", color: "text-primary" },
            ].map((a, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className={`text-sm font-medium ${a.color}`}>{a.action}</span>
                <span className="text-xs text-muted-foreground">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
