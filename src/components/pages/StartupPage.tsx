import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Save, Info, Terminal, Coffee, Wrench, Plus, Trash2 } from "lucide-react";

export function StartupPage() {
  const { toast } = useToast();
  const [startupCommand, setStartupCommand] = useState("java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}");
  const [serverJar, setServerJar] = useState("paper-1.20.1.jar");
  const [dockerImage, setDockerImage] = useState("ghcr.io/pterodactyl/yolks:java_17");
  const [envVars, setEnvVars] = useState<{ key: string; value: string }[]>([
    { key: "SERVER_JARFILE", value: "paper-1.20.1.jar" },
    { key: "SERVER_MEMORY", value: "2048" },
  ]);
  const [javaVersion, setJavaVersion] = useState("17");
  const [jvmFlags, setJvmFlags] = useState("-XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200");
  const [autoStart, setAutoStart] = useState(true);
  const [crashDetection, setCrashDetection] = useState(true);
  const [debugMode, setDebugMode] = useState(false);

  const addEnvVar = () => setEnvVars([...envVars, { key: "", value: "" }]);
  const removeEnvVar = (i: number) => setEnvVars(envVars.filter((_, idx) => idx !== i));
  const updateEnvVar = (i: number, field: "key" | "value", val: string) => {
    const updated = [...envVars];
    updated[i][field] = val;
    setEnvVars(updated);
  };

  const handleSave = () => {
    toast({ title: "⚠️ Settings saved", description: "A server restart is required for changes to take effect.", variant: "destructive" });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">Startup</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Advanced configuration</p>
      </div>

      {/* Warning */}
      <div className="panel-card flex items-start gap-3 p-4 border-warning/30 bg-warning/5">
        <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-warning">Proceed with caution</p>
          <p className="text-xs text-muted-foreground mt-0.5">Modifying startup settings incorrectly can prevent your server from starting.</p>
        </div>
      </div>

      {/* Server Info */}
      <div className="panel-card p-5 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center"><Info className="h-4 w-4 text-primary" /></div>
          <h2 className="text-base font-semibold text-foreground">Server Information</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <InfoTile label="Server Version" value="Paper 1.20.1" />
          <InfoTile label="Server Type" value="Paper" />
          <InfoTile label="Status" value="Online" badge="success" />
          <InfoTile label="Node" value="IN-1 (Mumbai)" />
        </div>
      </div>

      {/* Startup Config */}
      <div className="panel-card p-5 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center"><Terminal className="h-4 w-4 text-primary" /></div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Startup Configuration</h2>
            <p className="text-xs text-muted-foreground">Define how your server starts</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Startup Command</Label>
            <Input value={startupCommand} onChange={(e) => setStartupCommand(e.target.value)} className="font-mono text-xs rounded-xl" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Server Jar</Label>
              <Select value={serverJar} onValueChange={setServerJar}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="paper-1.20.1.jar">paper-1.20.1.jar</SelectItem>
                  <SelectItem value="spigot-1.20.1.jar">spigot-1.20.1.jar</SelectItem>
                  <SelectItem value="purpur-1.20.1.jar">purpur-1.20.1.jar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Docker Image</Label>
              <Input value={dockerImage} onChange={(e) => setDockerImage(e.target.value)} className="font-mono text-xs rounded-xl" />
            </div>
          </div>

          {/* Env Vars */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Environment Variables</Label>
              <button onClick={addEnvVar} className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors">
                <Plus className="h-3 w-3" /> Add Variable
              </button>
            </div>
            <div className="space-y-2">
              {envVars.map((env, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input value={env.key} onChange={(e) => updateEnvVar(i, "key", e.target.value)} placeholder="KEY" className="font-mono text-xs flex-1 rounded-xl" />
                  <span className="text-muted-foreground text-xs">=</span>
                  <Input value={env.value} onChange={(e) => updateEnvVar(i, "value", e.target.value)} placeholder="value" className="font-mono text-xs flex-1 rounded-xl" />
                  <button onClick={() => removeEnvVar(i)} className="shrink-0 h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Java */}
      <div className="panel-card p-5 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center"><Coffee className="h-4 w-4 text-primary" /></div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Java Settings</h2>
            <p className="text-xs text-muted-foreground">Configure Java runtime</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Java Version</Label>
            <Select value={javaVersion} onValueChange={setJavaVersion}>
              <SelectTrigger className="w-48 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="8">Java 8</SelectItem>
                <SelectItem value="11">Java 11</SelectItem>
                <SelectItem value="17">Java 17 (Recommended)</SelectItem>
                <SelectItem value="21">Java 21</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>JVM Flags</Label>
            <Textarea value={jvmFlags} onChange={(e) => setJvmFlags(e.target.value)} rows={3} className="font-mono text-xs rounded-xl" />
          </div>
        </div>
      </div>

      {/* Advanced */}
      <div className="panel-card p-5 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center"><Wrench className="h-4 w-4 text-primary" /></div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Advanced Options</h2>
            <p className="text-xs text-muted-foreground">Runtime behavior toggles</p>
          </div>
        </div>
        <div className="space-y-3">
          <ToggleRow label="Auto Start" description="Automatically start the server when the node boots" checked={autoStart} onChange={setAutoStart} />
          <ToggleRow label="Crash Detection" description="Automatically restart on crash" checked={crashDetection} onChange={setCrashDetection} />
          <ToggleRow label="Debug Mode" description="Enable verbose logging" checked={debugMode} onChange={setDebugMode} warning={debugMode} />
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center justify-between pb-8">
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5 text-warning" />
          Changing startup settings may break your server
        </p>
        <button onClick={handleSave} className="btn-gradient flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold">
          <Save className="h-4 w-4" /> Save Changes
        </button>
      </div>
    </div>
  );
}

function InfoTile({ label, value, badge }: { label: string; value: string; badge?: "success" | "destructive" }) {
  return (
    <div className="rounded-xl border border-border/50 bg-secondary/20 p-3">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      {badge ? (
        <Badge variant="default" className={badge === "success" ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}>
          {value}
        </Badge>
      ) : (
        <p className="text-sm font-medium text-foreground">{value}</p>
      )}
    </div>
  );
}

function ToggleRow({ label, description, checked, onChange, warning }: {
  label: string; description: string; checked: boolean; onChange: (v: boolean) => void; warning?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between rounded-xl border p-4 ${warning ? "border-warning/30 bg-warning/5" : "border-border/60 bg-secondary/20"}`}>
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
