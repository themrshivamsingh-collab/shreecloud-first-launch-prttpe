import { useNavigate } from "react-router-dom";
import {
  Terminal, FolderOpen, Puzzle, Archive, Rocket, Users,
  Settings, Clock, UserPlus, Database, FileText, Activity,
  GitBranch, Home, User, LogOut, Globe, ChevronDown, ChevronLeft,
  LayoutTemplate, Zap
} from "lucide-react";
import scLogo from "@/assets/sc-logo.png";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const navGroups = [
  {
    label: "GENERAL",
    items: [
      { label: "Console", icon: Terminal },
      { label: "Settings", icon: Settings },
      { label: "Activity", icon: Activity },
    ],
  },
  {
    label: "MANAGEMENT",
    items: [
      { label: "Files", icon: FolderOpen },
      { label: "Players", icon: Users },
      { label: "Worlds", icon: Globe },
      { label: "Database", icon: Database },
      { label: "Backups", icon: Archive },
    ],
  },
  {
    label: "CONFIGURATION",
    items: [
      { label: "Startup", icon: Rocket },
      { label: "Server Properties", icon: FileText },
      { label: "Version", icon: GitBranch },
      { label: "Schedule", icon: Clock },
    ],
  },
  {
    label: "ADDONS",
    items: [
      { label: "Plugin Installer", icon: Puzzle },
      { label: "Templates", icon: LayoutTemplate },
      { label: "Subusers", icon: UserPlus },
    ],
  },
];

const bottomNav = [
  { label: "Home", icon: Home },
  { label: "Account", icon: User },
  { label: "Logout", icon: LogOut },
];

interface Props {
  activePage: string;
  onNavigate: (page: string) => void;
}

export function PanelSidebar({ activePage, onNavigate }: Props) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const isCollapsed = isMobile ? false : collapsed;

  const handleNav = (label: string) => {
    if (label === "Home") { navigate("/servers"); return; }
    if (label === "Logout") {
      localStorage.removeItem("shreecloud-user");
      navigate("/login");
      window.location.reload();
      return;
    }
    onNavigate(label);
  };

  const renderNavButton = (item: { label: string; icon: React.ElementType }, isBottom = false) => {
    const active = activePage === item.label;
    const btn = (
      <button
        key={item.label}
        onClick={() => handleNav(item.label)}
        className={`
          group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] min-h-[40px]
          transition-all duration-200 ease-out
          ${active
            ? "sidebar-item-active"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground hover:translate-x-0.5"
          }
          ${isCollapsed ? "justify-center px-0" : ""}
        `}
      >
        <item.icon className={`h-[18px] w-[18px] shrink-0 transition-colors duration-200 ${active ? "text-primary" : "group-hover:text-primary/70"}`} />
        {!isCollapsed && <span className="truncate font-medium tracking-[-0.01em]">{item.label}</span>}
      </button>
    );

    if (isCollapsed) {
      return (
        <Tooltip key={item.label}>
          <TooltipTrigger asChild>{btn}</TooltipTrigger>
          <TooltipContent side="right" className="text-xs font-medium">{item.label}</TooltipContent>
        </Tooltip>
      );
    }
    return btn;
  };

  return (
    <TooltipProvider delayDuration={150}>
      <aside
        className={`
          ${isCollapsed ? "w-[64px]" : "w-[240px]"}
          min-h-screen bg-sidebar flex flex-col border-r border-sidebar-border/60 shrink-0
          transition-all duration-300 ease-out relative
        `}
      >
        {/* Subtle gradient overlay at top */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/[0.03] to-transparent pointer-events-none" />

        {/* Brand */}
        <div className="relative flex items-center gap-3 px-4 h-[60px] border-b border-sidebar-border/40 shrink-0">
          <div className="relative">
            <img src={scLogo} alt="ShreeCloud" className="h-8 w-8 rounded-xl shrink-0 ring-1 ring-primary/10" />
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success border-2 border-sidebar" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <span className="font-bold text-foreground text-[14px] leading-none block lapsus-gradient-text tracking-[-0.02em]">ShreeCloud</span>
              <span className="text-[10px] text-muted-foreground/60 leading-none mt-1 block tracking-wide uppercase">Game Panel</span>
            </div>
          )}
        </div>

        {/* Server selector */}
        {!isCollapsed && (
          <div className="relative px-3 pt-3.5">
            <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-secondary/40 border border-border/40 text-[12px] hover:border-primary/25 transition-all hover:bg-secondary/60 backdrop-blur-sm group">
              <span className="relative h-2 w-2 rounded-full bg-success shrink-0">
                <span className="absolute inset-0 rounded-full bg-success animate-ping opacity-40" />
              </span>
              <span className="text-foreground font-medium truncate flex-1 text-left tracking-[-0.01em]">Survival SMP</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground/60 shrink-0 group-hover:text-muted-foreground transition-colors" />
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="relative flex-1 overflow-y-auto px-2.5 pt-4 pb-2 space-y-5 terminal-scroll">
          {navGroups.map((group) => (
            <div key={group.label}>
              {!isCollapsed && (
                <span className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground/30 uppercase px-3 mb-2 block">
                  {group.label}
                </span>
              )}
              {isCollapsed && <div className="border-t border-sidebar-border/20 my-2 mx-1" />}
              <div className="space-y-0.5">
                {group.items.map((item) => renderNavButton(item))}
              </div>
            </div>
          ))}
        </nav>

        {/* Pro badge */}
        {!isCollapsed && (
          <div className="mx-3 mb-2">
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-primary/[0.08] to-primary/[0.03] border border-primary/10">
              <div className="h-6 w-6 rounded-lg bg-primary/15 flex items-center justify-center">
                <Zap className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-semibold text-foreground/80 block">Pro Plan</span>
                <span className="text-[9px] text-muted-foreground/50">Unlimited resources</span>
              </div>
            </div>
          </div>
        )}

        {/* Collapse toggle */}
        {!isMobile && (
          <div className="px-2.5 py-1">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-muted-foreground/50 hover:text-foreground hover:bg-sidebar-accent transition-all text-xs"
            >
              <ChevronLeft className={`h-4 w-4 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} />
              {!isCollapsed && <span className="tracking-wide">Collapse</span>}
            </button>
          </div>
        )}

        <div className="mx-3 border-t border-sidebar-border/20" />

        {/* Bottom nav */}
        <nav className="px-2.5 py-2.5 space-y-0.5">
          {bottomNav.map((item) => renderNavButton(item, true))}
        </nav>
      </aside>
    </TooltipProvider>
  );
}
