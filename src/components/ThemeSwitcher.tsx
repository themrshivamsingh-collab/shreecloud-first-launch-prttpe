import { useState, useRef, useEffect } from "react";
import { Palette, Check, Sparkles } from "lucide-react";
import { useTheme, THEME_NAMES } from "@/contexts/ThemeContext";

const THEME_COLORS: Record<number, { bg: string; primary: string; accent: string; label: string }> = {
  0: { bg: "hsl(230,25%,7%)", primary: "hsl(234,85%,65%)", accent: "hsl(260,70%,55%)", label: "Indigo" },
  1: { bg: "hsl(0,20%,8%)", primary: "hsl(0,72%,51%)", accent: "hsl(350,80%,45%)", label: "Crimson" },
  2: { bg: "hsl(155,25%,7%)", primary: "hsl(152,76%,44%)", accent: "hsl(170,65%,38%)", label: "Emerald" },
  3: { bg: "hsl(35,22%,8%)", primary: "hsl(38,92%,50%)", accent: "hsl(25,85%,42%)", label: "Gold" },
  4: { bg: "hsl(268,25%,8%)", primary: "hsl(265,80%,60%)", accent: "hsl(290,70%,50%)", label: "Purple" },
  5: { bg: "hsl(188,30%,7%)", primary: "hsl(180,70%,48%)", accent: "hsl(195,65%,42%)", label: "Teal" },
  6: { bg: "hsl(18,25%,8%)", primary: "hsl(24,90%,55%)", accent: "hsl(10,82%,48%)", label: "Orange" },
  7: { bg: "hsl(332,22%,8%)", primary: "hsl(335,78%,58%)", accent: "hsl(315,70%,48%)", label: "Rose" },
};

export function ThemeSwitcher() {
  const { themeId, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const handleSelect = (id: number) => {
    setTheme(id);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
          bg-card/60 border border-border/50 text-muted-foreground
          hover:text-foreground hover:border-primary/30 hover:bg-card
          transition-all duration-200"
        title="Switch Theme"
      >
        <div
          className="h-4 w-4 rounded-full shrink-0"
          style={{
            background: `linear-gradient(135deg, ${THEME_COLORS[themeId].primary}, ${THEME_COLORS[themeId].accent})`,
            boxShadow: `0 0 8px ${THEME_COLORS[themeId].primary}40`,
          }}
        />
        <Palette className="h-4 w-4" />
        <span className="hidden sm:inline">Theme</span>
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 mt-2 w-[340px] p-3 rounded-2xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl z-50 dropdown-enter"
          style={{
            boxShadow: `0 24px 80px -12px hsl(var(--background) / 0.8), 0 0 1px hsl(var(--border))`,
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 px-2 pb-3 mb-3 border-b border-border/30">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Panel Theme</span>
            <span className="ml-auto text-[10px] text-muted-foreground uppercase tracking-wider">
              {THEME_NAMES[themeId]}
            </span>
          </div>

          {/* Theme Grid */}
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(THEME_COLORS).map(([idStr, colors]) => {
              const id = Number(idStr);
              const isActive = themeId === id;

              return (
                <button
                  key={id}
                  onClick={() => handleSelect(id)}
                  className={`theme-card group text-left ${isActive ? "active" : ""}`}
                  style={{
                    ["--swatch-glow" as string]: colors.primary,
                  }}
                >
                  {/* Mini preview */}
                  <div
                    className="rounded-lg h-16 mb-2 relative overflow-hidden"
                    style={{ background: colors.bg }}
                  >
                    {/* Sidebar mock */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-8 border-r"
                      style={{
                        background: `color-mix(in srgb, ${colors.bg} 80%, ${colors.primary} 5%)`,
                        borderColor: `color-mix(in srgb, ${colors.bg} 70%, ${colors.primary} 15%)`,
                      }}
                    >
                      <div className="mt-2 mx-1 space-y-1.5">
                        <div className="h-1.5 w-full rounded" style={{ background: colors.primary, opacity: 0.7 }} />
                        <div className="h-1 w-4 rounded" style={{ background: colors.primary, opacity: 0.2 }} />
                        <div className="h-1 w-4 rounded" style={{ background: colors.primary, opacity: 0.2 }} />
                      </div>
                    </div>

                    {/* Content mock */}
                    <div className="absolute left-10 top-2 right-2 space-y-1.5">
                      <div
                        className="h-2 w-12 rounded"
                        style={{ background: `color-mix(in srgb, ${colors.bg} 50%, white 20%)` }}
                      />
                      <div
                        className="h-6 rounded-md"
                        style={{
                          background: `color-mix(in srgb, ${colors.bg} 70%, ${colors.primary} 10%)`,
                          border: `1px solid color-mix(in srgb, ${colors.bg} 60%, ${colors.primary} 15%)`,
                        }}
                      />
                      <div className="flex gap-1">
                        <div
                          className="h-3 flex-1 rounded-sm"
                          style={{ background: `color-mix(in srgb, ${colors.bg} 70%, ${colors.primary} 10%)` }}
                        />
                        <div
                          className="h-3 flex-1 rounded-sm"
                          style={{ background: `color-mix(in srgb, ${colors.bg} 70%, ${colors.primary} 10%)` }}
                        />
                      </div>
                    </div>

                    {/* Gradient glow */}
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        background: `radial-gradient(circle at 70% 30%, ${colors.primary}, transparent 60%)`,
                      }}
                    />
                  </div>

                  {/* Label row */}
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3.5 w-3.5 rounded-full shrink-0 ring-1 ring-inset"
                      style={{
                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                        ["--tw-ring-color" as string]: isActive ? "hsl(var(--foreground) / 0.5)" : "transparent",
                      }}
                    />
                    <span className="text-xs font-medium text-foreground truncate">
                      {THEME_NAMES[id]}
                    </span>
                    {isActive && (
                      <Check className="h-3.5 w-3.5 text-primary ml-auto shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer hint */}
          <div className="mt-3 pt-2 border-t border-border/30 text-center">
            <span className="text-[10px] text-muted-foreground/50">
              Theme is saved automatically
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
