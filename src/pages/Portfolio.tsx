import { motion } from "framer-motion";
import StatCard from "@/components/StatCard";
import { portfolioData } from "@/data/mockData";
import { TrendingUp, Coins, DollarSign, Package } from "lucide-react";

const Portfolio = () => {
  const fmt = (n: number) => "$" + n.toLocaleString();

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl">
      <h1 className="text-3xl font-display font-bold text-foreground">Portfolio</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Value" value={fmt(portfolioData.totalValue)} trend={12.5} icon={<TrendingUp className="w-5 h-5" />} />
        <StatCard title="RT" value={fmt(portfolioData.rtBalance)} icon={<Coins className="w-5 h-5" />} />
        <StatCard title="RS" value={fmt(portfolioData.rsBalance)} icon={<DollarSign className="w-5 h-5" />} />
        <StatCard title="RWA Tokens" value={fmt(portfolioData.rwaValue)} icon={<Package className="w-5 h-5" />} />
      </div>

      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Asset</th>
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Value</th>
              <th className="px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">PnL</th>
            </tr>
          </thead>
          <tbody>
            {portfolioData.holdings.map((h) => (
              <tr key={h.asset} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <td className="px-5 py-4 font-semibold text-sm text-foreground">{h.asset}</td>
                <td className="px-5 py-4 text-sm text-muted-foreground">{h.amount.toLocaleString()}</td>
                <td className="px-5 py-4 text-sm font-medium text-foreground">${h.value.toLocaleString()}</td>
                <td className={`px-5 py-4 text-sm font-semibold ${h.pnl >= 0 ? "text-emerald" : "text-destructive"}`}>
                  {h.pnl >= 0 ? "+" : ""}{h.pnl}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Portfolio;
