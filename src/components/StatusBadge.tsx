import { Shield, ShieldCheck, ShieldAlert } from "lucide-react";

interface StatusBadgeProps {
  status: "Verified" | "Pending" | "Unverified";
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = {
    Verified: { icon: ShieldCheck, className: "bg-emerald/10 text-emerald border-emerald/20" },
    Pending: { icon: Shield, className: "bg-primary/10 text-primary border-primary/20" },
    Unverified: { icon: ShieldAlert, className: "bg-muted text-muted-foreground border-border" },
  };

  const { icon: Icon, className } = config[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${className}`}>
      <Icon className="w-3.5 h-3.5" />
      {status}
    </span>
  );
};

export default StatusBadge;
