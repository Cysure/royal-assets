import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, BarChart3, ArrowLeftRight, Briefcase, Coins, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";

const navItems = [
  { title: "Dashboard", path: "/", icon: LayoutDashboard },
  { title: "Assets", path: "/assets", icon: Package },
  { title: "Markets", path: "/markets", icon: BarChart3 },
  { title: "Trade", path: "/trade", icon: ArrowLeftRight },
  { title: "Portfolio", path: "/portfolio", icon: Briefcase },
  { title: "Stake RT", path: "/stake", icon: Coins },
  { title: "Settings", path: "/settings", icon: Settings },
];

const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.2 }}
      className="h-screen sticky top-0 flex flex-col bg-card border-r border-border z-50"
    >
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border">
        <img src={logo} alt="Royal" className="h-7 w-auto" />
        <AnimatePresence>
          {!collapsed && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-display font-bold text-lg tracking-tight text-foreground">
              Network
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-primary/10 text-primary gold-glow"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {item.title}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 border-t border-border text-muted-foreground hover:text-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </motion.aside>
  );
};

export default AppSidebar;
