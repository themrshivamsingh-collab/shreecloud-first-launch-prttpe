import { useState, useRef, useEffect } from "react";
import { Play, RotateCcw, Square, Cpu, HardDrive, Clock, Wifi, MemoryStick, CircleDot, Loader2 } from "lucide-react";
import { useTheme, THEME_NAMES } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useParams } from "react-router-dom";
import { getServerResources, getServerDetails, sendCommand, sendPowerAction } from "@/lib/pterodactyl";
import { MOCK_RESOURCES, MOCK_SERVER_DETAILS, MOCK_CONSOLE_LOGS } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

/* ── Log Entry Type ── */
interface LogEntry {
  timestamp: string;
  level: "info" | "warn" | "error" | "command";
  message: string;
}

function formatTimestamp() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

/* ── Reusable Stat Card ── */
function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType; label: string; value: string; color: string;
}) {
  return (
    <div className="stat-card">
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className={`h-3.5 w-3.5 ${color}`} />
        <span className="text-[10px] sm:text-[11px] text-muted-foreground uppercase tracking-wider font-medium">{label}</span>
      </div>
      <p className="text-xs sm:text-sm font-semibold text-foreground truncate">{value}</p>
    </div>
  );
}

/* ── Resource Graph ── */
function ResourceGraph({ title, data, color, gradientId, unit, icon: Icon, currentValue }: {
  title: string;
  data: { time: string; value: number }[];
  color: string;
  gradientId: string;
  unit: string;
  icon: React.ElementType;
  currentValue: string;
}) {
  return (
    <div className="arix-card p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-md bg-primary/8 flex items-center justify-center border border-border/50">
            <Icon className="h-4 w-4" style={{ color }} />
          </div>
          <div>
            <span className="text-sm font-medium text-foreground">{title}</span>
            <span className="text-xs text-muted-foreground ml-2 font-mono">{currentValue}</span>
          </div>
        </div>
      </div>
      <div className="h-[100px] sm:h-[130px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}${unit}`}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
                fontSize: "12px",
                color: "hsl(var(--foreground))",
                padding: "8px 12px",
              }}
              formatter={(value: number) => [`${value.toFixed(1)}${unit}`, title]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={1.5}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{ r: 3, strokeWidth: 2, fill: color }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function formatUptime(ms: number) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h}h ${m}m`;
}

function getLogColor(level: string) {
  switch (level) {
    case "error": return "text-destructive";
    case "warn": return "text-warning";
    case "command": return "text-primary";
    default: return "text-foreground/60";
  }
}

export function ConsolePage() {
  const { serverId } = useParams();
  const { toast } = useToast();
  const { setTheme } = useTheme();
  const { isDemoMode } = useAuth();

  const [logs, setLogs] = useState<LogEntry[]>([
    { timestamp: formatTimestamp(), level: "info", message: "[ShreeCloud] Connecting to server..." }
  ]);
  const [command, setCommand] = useState("");
  const [resources, setResources] = useState<any>(null);
  const [serverInfo, setServerInfo] = useState<any>(null);
  const [cpuHistory, setCpuHistory] = useState<{ time: string; value: number }[]>([]);
  const [ramHistory, setRamHistory] = useState<{ time: string; value: number }[]>([]);
  const [diskHistory, setDiskHistory] = useState<{ time: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const terminalRef = useRef<HTMLDivElement>(null);

  const addLog = (level: LogEntry["level"], message: string) => {
    setLogs((prev) => [...prev, { timestamp: formatTimestamp(), level, message }]);
  };

  // Load mock data for demo mode
  useEffect(() => {
    if (!isDemoMode) return;
    
    setServerInfo(MOCK_SERVER_DETAILS);
    setResources(MOCK_RESOURCES);
    
    // Populate mock logs
    setTimeout(() => {
      const mockLogs: LogEntry[] = MOCK_CONSOLE_LOGS.map(l => ({
        timestamp: l.time,
        level: l.level as LogEntry["level"],
        message: l.message,
      }));
      setLogs(prev => [...prev, ...mockLogs]);
      setLoading(false);
    }, 600);

    // Simulate resource fluctuations
    const interval = setInterval(() => {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const cpuVal = 25 + Math.random() * 30;
      const memPct = 40 + Math.random() * 20;
      const diskPct = 18 + Math.random() * 5;
      setCpuHistory((prev) => [...prev.slice(-19), { time: now, value: cpuVal }]);
      setRamHistory((prev) => [...prev.slice(-19), { time: now, value: memPct }]);
      setDiskHistory((prev) => [...prev.slice(-19), { time: now, value: diskPct }]);
    }, 3000);
    return () => clearInterval(interval);
  }, [isDemoMode]);

  // Real data fetch
  useEffect(() => {
    if (isDemoMode || !serverId) return;
    getServerDetails(serverId)
      .then(setServerInfo)
      .catch((e) => {
        addLog("error", `Error loading server details: ${e.message}`);
        console.error(`[${formatTimestamp()}] Error loading server data:`, e.message);
      });
  }, [serverId, isDemoMode]);

  const fetchResources = async () => {
    if (isDemoMode || !serverId) return;
    try {
      const res = await getServerResources(serverId);
      setResources(res);
      const limits = serverInfo?.limits || {};
      const now = formatTimestamp();
      const cpuVal = res.resources?.cpu_absolute ?? 0;
      const memPct = res.resources?.memory_bytes && limits.memory
        ? (res.resources.memory_bytes / (limits.memory * 1024 * 1024)) * 100 : 0;
      const diskPct = res.resources?.disk_bytes && limits.disk
        ? (res.resources.disk_bytes / (limits.disk * 1024 * 1024)) * 100 : 0;

      setCpuHistory((prev) => [...prev.slice(-19), { time: now, value: cpuVal }]);
      setRamHistory((prev) => [...prev.slice(-19), { time: now, value: memPct }]);
      setDiskHistory((prev) => [...prev.slice(-19), { time: now, value: diskPct }]);

      if (loading) {
        addLog("info", `Server status: ${res.current_state || 'unknown'}`);
        setLoading(false);
      }
    } catch (e: any) {
      if (loading) {
        addLog("error", e.message);
        console.error(`[${formatTimestamp()}] Error loading server data:`, e.message);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (isDemoMode) return;
    fetchResources();
    const interval = setInterval(fetchResources, 5000);
    return () => clearInterval(interval);
  }, [serverId, isDemoMode]);

  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [logs]);

  const handleCommand = async () => {
    if (!command.trim()) return;
    
    const themeMatch = command.trim().match(/^theme\s+(\d)$/i);
    if (themeMatch) {
      const id = parseInt(themeMatch[1], 10);
      if (id >= 0 && id <= 7) {
        setTheme(id);
        addLog("command", `> ${command}`);
        addLog("info", `Theme changed to: ${THEME_NAMES[id]}`);
      } else {
        addLog("command", `> ${command}`);
        addLog("error", `Invalid theme. Use "theme 0" to "theme 7".`);
      }
      setCommand("");
      return;
    }

    addLog("command", `> ${command}`);

    if (isDemoMode) {
      // Simulate command responses in demo mode
      setTimeout(() => {
        addLog("info", `[Server] Command executed: ${command}`);
      }, 300);
      setCommand("");
      return;
    }

    if (!serverId) return;
    try {
      await sendCommand(serverId, command);
      addLog("info", "Command sent.");
    } catch (e: any) {
      addLog("error", e.message);
    }
    setCommand("");
  };

  const handlePower = async (signal: 'start' | 'stop' | 'restart') => {
    if (isDemoMode) {
      toast({ title: `Power: ${signal}`, description: `Signal sent to server (demo).` });
      addLog("info", `Power signal "${signal}" sent.`);
      return;
    }
    if (!serverId) return;
    try {
      await sendPowerAction(serverId, signal);
      toast({ title: `Power: ${signal}`, description: `Signal sent to server.` });
      addLog("info", `Power signal "${signal}" sent.`);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
      addLog("error", e.message);
    }
  };

  const currentState = resources?.current_state || "unknown";
  const res = resources?.resources || {};
  const limits = serverInfo?.limits || {};

  const cpuStr = `${(res.cpu_absolute ?? 0).toFixed(1)}%`;
  const ramStr = `${formatBytes(res.memory_bytes ?? 0)} / ${limits.memory ?? 0} MB`;
  const diskStr = `${formatBytes(res.disk_bytes ?? 0)} / ${limits.disk ?? 0} MB`;
  const uptimeStr = res.uptime ? formatUptime(res.uptime) : "—";

  const stateColor = currentState === "running" ? "text-success" : currentState === "starting" ? "text-warning" : "text-muted-foreground";
  const stateLabel = currentState.charAt(0).toUpperCase() + currentState.slice(1);

  return (
    <div className="space-y-5 max-w-6xl">
      {/* Header + Power buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-foreground">Console</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Server — <span className={stateColor}>{stateLabel}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handlePower('start')} className="btn-glow flex items-center gap-1.5 px-4 py-2 rounded-md bg-success hover:bg-success/90 text-success-foreground font-medium text-xs active:scale-[0.96] transition-transform">
            <Play className="h-3.5 w-3.5" /> Start
          </button>
          <button onClick={() => handlePower('restart')} className="btn-glow flex items-center gap-1.5 px-4 py-2 rounded-md bg-warning hover:bg-warning/90 text-warning-foreground font-medium text-xs active:scale-[0.96] transition-transform">
            <RotateCcw className="h-3.5 w-3.5" /> Restart
          </button>
          <button onClick={() => handlePower('stop')} className="btn-glow flex items-center gap-1.5 px-4 py-2 rounded-md bg-destructive hover:bg-destructive/90 text-destructive-foreground font-medium text-xs active:scale-[0.96] transition-transform">
            <Square className="h-3.5 w-3.5" /> Stop
          </button>
        </div>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        <StatCard icon={CircleDot} label="Status" value={stateLabel} color={stateColor} />
        <StatCard icon={Cpu} label="CPU" value={cpuStr} color="text-success" />
        <StatCard icon={MemoryStick} label="RAM" value={ramStr} color="text-primary" />
        <StatCard icon={HardDrive} label="Disk" value={diskStr} color="text-warning" />
        <StatCard icon={Clock} label="Uptime" value={uptimeStr} color="text-muted-foreground" />
      </div>

      {/* Terminal */}
      <div className="terminal-container">
        <div className="terminal-header">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-warning/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-success/70" />
          </div>
          <span className="ml-2 text-[11px] text-muted-foreground font-mono tracking-wider">server console</span>
        </div>
        <div ref={terminalRef} className="terminal-body terminal-scroll h-[280px] sm:h-[360px]">
          {logs.map((entry, i) => (
            <div key={i} className={`py-0.5 flex gap-2 ${getLogColor(entry.level)}`}>
              <span className="text-muted-foreground/40 font-mono text-[11px] shrink-0 select-none">{entry.timestamp}</span>
              <span className="break-all">{entry.message}</span>
            </div>
          ))}
        </div>
        <div className="terminal-input-row">
          <span className="px-3 sm:px-4 py-3 text-primary font-mono text-sm select-none">$</span>
          <input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCommand()}
            placeholder="Type a command..."
            className="flex-1 bg-transparent py-3 pr-4 text-sm font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none min-w-0"
          />
        </div>
      </div>

      {/* Resource Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ResourceGraph
          title="CPU Usage"
          data={cpuHistory}
          color="hsl(var(--success))"
          gradientId="graph-cpu"
          unit="%"
          icon={Cpu}
          currentValue={cpuStr}
        />
        <ResourceGraph
          title="Memory Usage"
          data={ramHistory}
          color="hsl(var(--primary))"
          gradientId="graph-ram"
          unit="%"
          icon={MemoryStick}
          currentValue={ramStr}
        />
        <ResourceGraph
          title="Disk Usage"
          data={diskHistory}
          color="hsl(var(--warning))"
          gradientId="graph-disk"
          unit="%"
          icon={HardDrive}
          currentValue={diskStr}
        />
        <ResourceGraph
          title="Network I/O"
          data={cpuHistory.map((d) => ({
            time: d.time,
            value: Math.min(100, ((res.network_tx_bytes ?? 0) + (res.network_rx_bytes ?? 0)) / (1024 * 1024 * 10) || 0),
          }))}
          color="hsl(var(--primary))"
          gradientId="graph-net"
          unit="%"
          icon={Wifi}
          currentValue={`↑ ${formatBytes(res.network_tx_bytes ?? 0)} / ↓ ${formatBytes(res.network_rx_bytes ?? 0)}`}
        />
      </div>
    </div>
  );
}
