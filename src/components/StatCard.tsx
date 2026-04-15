import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
  trend?: number;
  className?: string;
}

const StatCard = ({ title, value, subtitle, icon, trend, className }: StatCardProps) => {
  return (
    <div className={cn("rounded-xl bg-card border border-border p-5 transition-all duration-200 hover:shadow-lg hover:border-primary/20", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-display font-bold mt-1 text-foreground">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          {trend !== undefined && (
            <p className={`text-sm font-medium mt-1 ${trend >= 0 ? "text-emerald" : "text-destructive"}`}>
              {trend >= 0 ? "+" : ""}{trend}%
            </p>
          )}
        </div>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
    </div>
  );
};

export default StatCard;
