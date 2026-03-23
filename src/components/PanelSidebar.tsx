import { useNavigate } from "react-router-dom";
import {
  Terminal, FolderOpen, Puzzle, Archive, Rocket, Users,
  Settings, Clock, UserPlus, Database, FileText, Activity,
  GitBranch, Home, User, LogOut, Globe, ChevronDown, ChevronLeft,
  LayoutTemplate
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
          group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all duration-200 min-h-[38px]
          ${active
            ? "sidebar-item-active"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
          }
          ${isCollapsed ? "justify-center px-0" : ""}
        `}
      >
        <item.icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-primary" : ""}`} />
        {!isCollapsed && <span className="truncate">{item.label}</span>}
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
          ${isCollapsed ? "w-[60px]" : "w-[230px]"}
          min-h-screen bg-sidebar flex flex-col border-r border-sidebar-border shrink-0
          transition-all duration-300 ease-out
        `}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-4 h-[56px] border-b border-sidebar-border/60 shrink-0">
          <img src={scLogo} alt="ShreeCloud" className="h-8 w-8 rounded-xl shrink-0" />
          {!isCollapsed && (
            <div className="min-w-0">
              <span className="font-bold text-foreground text-[14px] leading-none block lapsus-gradient-text">ShreeCloud</span>
              <span className="text-[10px] text-muted-foreground leading-none mt-0.5 block">Game Panel</span>
            </div>
          )}
        </div>

        {/* Server selector */}
        {!isCollapsed && (
          <div className="px-3 pt-3">
            <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-secondary/50 border border-border/60 text-[12px] hover:border-primary/20 transition-all hover:bg-secondary/70">
              <span className="h-2 w-2 rounded-full bg-success shrink-0 glow-pulse" />
              <span className="text-foreground font-medium truncate flex-1 text-left">Survival SMP</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2.5 pt-4 pb-2 space-y-4 terminal-scroll">
          {navGroups.map((group) => (
            <div key={group.label}>
              {!isCollapsed && (
                <span className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground/40 uppercase px-3 mb-1.5 block">
                  {group.label}
                </span>
              )}
              {isCollapsed && <div className="border-t border-sidebar-border/30 my-2 mx-1" />}
              <div className="space-y-0.5">
                {group.items.map((item) => renderNavButton(item))}
              </div>
            </div>
          ))}
        </nav>

        {/* Collapse toggle */}
        {!isMobile && (
          <div className="px-2.5 py-1.5">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-all text-xs"
            >
              <ChevronLeft className={`h-4 w-4 transition-transform duration-200 ${isCollapsed ? "rotate-180" : ""}`} />
              {!isCollapsed && <span>Collapse</span>}
            </button>
          </div>
        )}

        <div className="mx-3 border-t border-sidebar-border/40" />

        {/* Bottom nav */}
        <nav className="px-2.5 py-2.5 space-y-0.5">
          {bottomNav.map((item) => renderNavButton(item, true))}
        </nav>
      </aside>
    </TooltipProvider>
  );
}
