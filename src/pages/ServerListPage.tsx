import { useNavigate } from "react-router-dom";
import { Cloud, Server, LogOut, Circle, Search, Loader2, AlertCircle, ServerOff, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { listServers } from "@/lib/pterodactyl";
import scLogo from "@/assets/sc-logo.png";

export default function ServerListPage() {
  const navigate = useNavigate();
  const { user, logout, isDemoMode } = useAuth();
  const [search, setSearch] = useState("");
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listServers()
      .then((data) => {
        setServers(data);
        setError(null);
      })
      .catch((e) => {
        const msg = e.message || 'Error loading server data. Please refresh or try again.';
        setError(msg);
        console.error(`[${new Date().toLocaleTimeString()}] Error loading server data:`, msg);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = servers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getStatusInfo = (server: any) => {
    if (server.isSuspended) return { label: "Suspended", color: "destructive" };
    if (server.isInstalling) return { label: "Installing", color: "warning" };
    return { label: server.status === null ? "Available" : server.status || "Unknown", color: server.status === null ? "success" : "muted" };
  };

  const getErrorDisplay = (err: string) => {
    if (err.includes('Unable to connect') || err.includes('fetch')) {
      return { title: "Connection Error", message: "Unable to connect to server panel. Please try again later." };
    }
    if (err.includes('Access denied') || err.includes('permissions')) {
      return { title: "Access Denied", message: "Access denied. Please check your account permissions." };
    }
    return { title: "Error", message: err };
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Ambient background */}
      <div className="ambient-bg" />
      <div className="noise-overlay" />

      <header className="relative z-10 border-b border-border/40 bg-card/40 backdrop-blur-xl sticky top-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={scLogo} alt="ShreeCloud" className="h-9 w-9 rounded-xl ring-1 ring-primary/10" />
              <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success border-2 border-card" />
            </div>
            <div>
              <span className="font-bold text-foreground text-sm lapsus-gradient-text tracking-[-0.02em]">ShreeCloud Panel</span>
              <span className="text-[10px] text-muted-foreground/50 block">Game Server Management</span>
            </div>
            {isDemoMode && (
              <Badge variant="outline" className="text-[10px] border-warning/20 text-warning bg-warning/5 ml-1">
                Demo
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/30 border border-border/30">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-[10px] font-bold text-primary">{user?.username?.charAt(0).toUpperCase()}</span>
              </div>
              <span className="text-xs text-muted-foreground font-medium">{user?.username}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5 text-muted-foreground hover:text-foreground min-h-[40px] hover:bg-destructive/10 hover:text-destructive">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div className="float-in">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-primary/50" />
              <span className="text-[10px] font-semibold text-primary/60 uppercase tracking-[0.15em]">Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-[-0.03em]">Your Servers</h1>
            <p className="text-muted-foreground/60 text-sm mt-1.5">Select a server to manage and monitor</p>
          </div>
          <div className="relative w-full sm:w-72 float-in float-in-delay-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
            <Input
              placeholder="Search servers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-11 bg-card/40 border-border/40 text-sm backdrop-blur-sm premium-input"
            />
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="relative">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
              <div className="absolute inset-0 rounded-2xl bg-primary/5 animate-ping" />
            </div>
            <div className="text-center">
              <span className="text-sm font-medium text-foreground/70">Loading servers</span>
              <p className="text-xs text-muted-foreground/50 mt-1">Fetching your server data...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-20 px-4 float-in">
            <div className="h-20 w-20 rounded-2xl bg-destructive/8 flex items-center justify-center mb-5 border border-destructive/10">
              <AlertCircle className="h-9 w-9 text-destructive/70" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1 tracking-[-0.02em]">{getErrorDisplay(error).title}</h3>
            <p className="text-sm text-muted-foreground/60 text-center max-w-md">{getErrorDisplay(error).message}</p>
            <Button
              variant="outline"
              className="mt-5 btn-premium"
              onClick={() => { setError(null); setLoading(true); window.location.reload(); }}
            >
              Try Again
            </Button>
          </div>
        )}

        {!loading && !error && servers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {filtered.map((server, i) => {
              const status = getStatusInfo(server);
              return (
                <Card
                  key={server.id}
                  className={`panel-card cursor-pointer group active:scale-[0.98] float-in float-in-delay-${Math.min(i + 1, 5)}`}
                  onClick={() => navigate(`/server/${server.id}`)}
                >
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center group-hover:from-primary/25 group-hover:to-primary/10 transition-all duration-300 shrink-0 border border-primary/10">
                          <Server className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-foreground truncate tracking-[-0.01em]">{server.name}</h3>
                          <p className="text-[11px] text-muted-foreground/50 mt-0.5">{server.node}</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`shrink-0 ml-2 ${
                          status.color === "success"
                            ? "border-success/20 text-success bg-success/8"
                            : "border-muted-foreground/20 text-muted-foreground bg-muted/30"
                        }`}
                      >
                        <Circle className="h-1.5 w-1.5 mr-1.5 fill-current" />
                        {status.label}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      {[
                        { label: "RAM", value: `${server.limits?.memory || 0} MB` },
                        { label: "Disk", value: `${server.limits?.disk || 0} MB` },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60 px-2 py-1 rounded-md bg-muted/20">
                          <span className="font-medium text-muted-foreground/40">{label}</span>
                          <span className="text-foreground/50 font-mono">{value}</span>
                        </div>
                      ))}
                      {server.allocation && (
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60 px-2 py-1 rounded-md bg-muted/20">
                          <span className="font-mono text-foreground/50 truncate">{server.allocation.ip}:{server.allocation.port}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && servers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 px-4 float-in">
            <div className="h-24 w-24 rounded-3xl bg-muted/20 flex items-center justify-center mb-6 border border-border/30">
              <ServerOff className="h-12 w-12 text-muted-foreground/25" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1.5 tracking-[-0.02em]">No Servers Found</h3>
            <p className="text-sm text-muted-foreground/50 text-center max-w-sm">
              There are no servers associated with this account.
            </p>
          </div>
        )}

        {/* Search empty */}
        {!loading && !error && servers.length > 0 && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-4 float-in">
            <Search className="h-10 w-10 text-muted-foreground/20 mb-3" />
            <p className="text-sm text-muted-foreground/50">No servers match "<span className="text-foreground/60">{search}</span>"</p>
          </div>
        )}
      </main>
    </div>
  );
}
