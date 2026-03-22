import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Cpu, MemoryStick, HardDrive, Wifi, Menu } from "lucide-react";

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
            className="flex items-center justify-center h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-all shrink-0"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <h2 className="text-sm font-bold text-foreground truncate">{activePage}</h2>
        <div className="h-4 w-px bg-border/50 hidden sm:block" />
        <ThemeSwitcher />
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 sm:gap-5 shrink-0">
        <div className="hidden lg:flex items-center gap-5 text-xs text-muted-foreground">
          {[
            { icon: Cpu, label: "24%" },
            { icon: MemoryStick, label: "1.2 GB" },
            { icon: HardDrive, label: "3.1 GB" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-secondary/40">
              <Icon className="h-3.5 w-3.5" />
              <span className="font-mono text-[11px]">{label}</span>
            </div>
          ))}
        </div>

        <div className="h-4 w-px bg-border/40 hidden lg:block" />

        {/* Status */}
        <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-success/10 border border-success/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
          </span>
          <span className="text-success font-semibold">Online</span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground">
          <Wifi className="h-3.5 w-3.5" />
          <span className="font-mono">play.shreecloud.net</span>
        </div>
      </div>
    </header>
  );
}
