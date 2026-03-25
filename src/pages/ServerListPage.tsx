import { useNavigate } from "react-router-dom";
import { Cloud, Server, LogOut, Circle, Search, Loader2, AlertCircle, ServerOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { listServers } from "@/lib/pterodactyl";


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

  // Friendly error message mapping
  const getErrorDisplay = (err: string) => {
    if (err.includes('Unable to connect') || err.includes('fetch')) {
      return { title: "Connection Error", message: "Unable to connect to server panel. Please try again later.", icon: "connection" };
    }
    if (err.includes('Access denied') || err.includes('permissions')) {
      return { title: "Access Denied", message: "Access denied. Please check your account permissions.", icon: "access" };
    }
    return { title: "Error", message: err, icon: "generic" };
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <Cloud className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-foreground text-sm sm:text-base">ShreeCloud Panel</span>
            {isDemoMode && (
              <Badge variant="outline" className="text-[10px] border-warning/30 text-warning bg-warning/10 ml-1">
                Demo
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user?.username}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5 text-muted-foreground hover:text-foreground min-h-[40px]">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Your Servers</h1>
            <p className="text-muted-foreground text-sm mt-1">Select a server to manage</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search servers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 bg-muted/50 border-border text-sm"
            />
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading servers...</span>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">{getErrorDisplay(error).title}</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">{getErrorDisplay(error).message}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => { setError(null); setLoading(true); window.location.reload(); }}
            >
              Try Again
            </Button>
          </div>
        )}

        {!loading && !error && servers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {filtered.map((server) => {
              const status = getStatusInfo(server);
              return (
                <Card
                  key={server.id}
                  className="bg-card border-border hover:border-primary/40 transition-all duration-200 cursor-pointer group hover:shadow-lg hover:shadow-primary/5 arix-glow active:scale-[0.98]"
                  onClick={() => navigate(`/server/${server.id}`)}
                >
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                          <Server className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-foreground truncate">{server.name}</h3>
                          <p className="text-xs text-muted-foreground">{server.node}</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`shrink-0 ml-2 ${
                          status.color === "success"
                            ? "border-success/30 text-success bg-success/10"
                            : "border-muted-foreground/30 text-muted-foreground bg-muted/50"
                        }`}
                      >
                        <Circle className="h-2 w-2 mr-1.5 fill-current" />
                        {status.label}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>RAM: {server.limits?.memory || 0} MB</span>
                      <span>Disk: {server.limits?.disk || 0} MB</span>
                      {server.allocation && (
                        <span className="truncate">{server.allocation.ip}:{server.allocation.port}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Empty state — no servers */}
        {!loading && !error && servers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="h-20 w-20 rounded-2xl bg-muted/50 flex items-center justify-center mb-5 border border-border">
              <ServerOff className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">No Servers Found</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              There are no servers associated with this account.
            </p>
          </div>
        )}

        {/* Search empty state */}
        {!loading && !error && servers.length > 0 && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <Search className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No servers match "{search}"</p>
          </div>
        )}
      </main>
    </div>
  );
}
