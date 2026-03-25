import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Cpu, MemoryStick, HardDrive, Wifi, Menu, Bell } from "lucide-react";

interface Props {
  activePage: string;
  onMenuToggle?: () => void;
}

export function PanelTopBar({ activePage, onMenuToggle }: Props) {
  return (
    <header className="panel-topbar h-[56px] flex items-center justify-between px-4 sm:px-5 shrink-0 z-10">
      {/* Left */}
      <div className="flex items-center gap-3 min-w-0">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="flex items-center justify-center h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-all shrink-0 active:scale-95"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm font-bold text-foreground truncate tracking-[-0.02em]">{activePage}</h2>
          <span className="text-[10px] text-muted-foreground/40 font-medium hidden sm:inline">/ Server Dashboard</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Resource badges */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground">
          {[
            { icon: Cpu, label: "24%", color: "text-success" },
            { icon: MemoryStick, label: "1.2 GB", color: "text-primary" },
            { icon: HardDrive, label: "3.1 GB", color: "text-warning" },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-secondary/30 border border-border/30 backdrop-blur-sm hover:bg-secondary/50 transition-all cursor-default">
              <Icon className={`h-3.5 w-3.5 ${color}`} />
              <span className="font-mono text-[11px] text-foreground/70 font-medium">{label}</span>
            </div>
          ))}
        </div>

        <div className="h-4 w-px bg-border/30 hidden lg:block" />

        {/* Status */}
        <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-success/8 border border-success/15 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
          </span>
          <span className="text-success font-semibold tracking-wide">Online</span>
        </div>

        {/* Notification bell */}
        <button className="relative flex items-center justify-center h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-all active:scale-95">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>

        <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground/60">
          <Wifi className="h-3.5 w-3.5" />
          <span className="font-mono text-[11px]">play.shreecloud.net</span>
        </div>

        <ThemeSwitcher />
      </div>
    </header>
  );
}
