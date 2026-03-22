import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save, Server, Palette, Gamepad2, HardDrive, Shield, Upload } from "lucide-react";

export function SettingsPage() {
  const { toast } = useToast();

  const [serverName, setServerName] = useState("My Minecraft Server");
  const [description, setDescription] = useState("");
  const [motd, setMotd] = useState("A Minecraft Server");
  const [maxPlayers, setMaxPlayers] = useState("20");
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [themeColor, setThemeColor] = useState("#3b82f6");
  const [showPublicly, setShowPublicly] = useState(false);
  const [showStatus, setShowStatus] = useState(true);
  const [difficulty, setDifficulty] = useState("normal");
  const [gamemode, setGamemode] = useState("survival");
  const [pvpEnabled, setPvpEnabled] = useState(true);
  const [whitelistEnabled, setWhitelistEnabled] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState("daily");
  const [maxBackups, setMaxBackups] = useState("5");
  const [onlineMode, setOnlineMode] = useState(true);
  const [antiVpn, setAntiVpn] = useState(false);
  const [ipForwarding, setIpForwarding] = useState(false);

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setIconPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    toast({ title: "Settings saved", description: "Your server settings have been updated successfully." });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Customize your server appearance and behavior</p>
      </div>

      {/* Server Customization */}
      <SectionCard icon={Server} title="Server Customization" description="Configure your server's identity">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="server-name">Server Name</Label>
            <Input id="server-name" value={serverName} onChange={(e) => setServerName(e.target.value)} className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your server..." rows={3} className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="motd">MOTD</Label>
            <Input id="motd" value={motd} onChange={(e) => setMotd(e.target.value)} className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label>Server Icon</Label>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl border-2 border-dashed border-border bg-muted flex items-center justify-center overflow-hidden">
                {iconPreview ? (
                  <img src={iconPreview} alt="Server icon" className="h-full w-full object-cover" />
                ) : (
                  <Upload className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <label htmlFor="icon-upload">
                  <span className="cursor-pointer btn-gradient px-4 py-2 rounded-xl text-xs font-semibold inline-block">Upload Icon</span>
                </label>
                <input id="icon-upload" type="file" accept="image/*" className="hidden" onChange={handleIconUpload} />
                <p className="text-xs text-muted-foreground mt-1">64×64 PNG recommended</p>
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="max-players">Max Players</Label>
            <Input id="max-players" type="number" value={maxPlayers} onChange={(e) => setMaxPlayers(e.target.value)} min="1" max="1000" className="w-32 rounded-xl" />
          </div>
        </div>
      </SectionCard>

      {/* Appearance */}
      <SectionCard icon={Palette} title="Appearance" description="Visual settings for your server listing">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="theme-color">Theme Color</Label>
            <div className="flex items-center gap-3">
              <input type="color" id="theme-color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="h-10 w-14 rounded-lg border border-border bg-transparent cursor-pointer" />
              <Input value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="w-32 font-mono text-sm rounded-xl" />
            </div>
          </div>
          <ToggleRow label="Show Server Publicly" description="Make your server visible in public listings" checked={showPublicly} onChange={setShowPublicly} />
          <ToggleRow label="Enable Status Display" description="Show online/offline status badge" checked={showStatus} onChange={setShowStatus} />
        </div>
      </SectionCard>

      {/* Gameplay */}
      <SectionCard icon={Gamepad2} title="Gameplay Settings" description="Control how players experience your server">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="peaceful">Peaceful</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Gamemode</Label>
              <Select value={gamemode} onValueChange={setGamemode}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="survival">Survival</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="adventure">Adventure</SelectItem>
                  <SelectItem value="spectator">Spectator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <ToggleRow label="PvP Enabled" description="Allow players to fight each other" checked={pvpEnabled} onChange={setPvpEnabled} />
          <ToggleRow label="Whitelist Enabled" description="Only whitelisted players can join" checked={whitelistEnabled} onChange={setWhitelistEnabled} />
        </div>
      </SectionCard>

      {/* Backup */}
      <SectionCard icon={HardDrive} title="Backup Settings" description="Manage automatic backups">
        <div className="space-y-4">
          <ToggleRow label="Auto Backup" description="Automatically create server backups" checked={autoBackup} onChange={setAutoBackup} />
          {autoBackup && (
            <>
              <div className="space-y-1.5">
                <Label>Backup Frequency</Label>
                <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                  <SelectTrigger className="w-48 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Every Hour</SelectItem>
                    <SelectItem value="6hours">Every 6 Hours</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="max-backups">Max Backup Limit</Label>
                <Input id="max-backups" type="number" value={maxBackups} onChange={(e) => setMaxBackups(e.target.value)} min="1" max="50" className="w-32 rounded-xl" />
              </div>
            </>
          )}
        </div>
      </SectionCard>

      {/* Security */}
      <SectionCard icon={Shield} title="Security" description="Protect your server from threats">
        <div className="space-y-4">
          <ToggleRow label="Online Mode" description="Verify player accounts through Mojang" checked={onlineMode} onChange={setOnlineMode} />
          <ToggleRow label="Anti-VPN" description="Block connections from VPN services" checked={antiVpn} onChange={setAntiVpn} />
          <ToggleRow label="IP Forwarding" description="Forward player IPs from proxy servers" checked={ipForwarding} onChange={setIpForwarding} />
        </div>
      </SectionCard>

      {/* Save */}
      <div className="flex justify-end pb-8">
        <button onClick={handleSave} className="btn-gradient flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold">
          <Save className="h-4 w-4" /> Save Changes
        </button>
      </div>
    </div>
  );
}

function SectionCard({ icon: Icon, title, description, children }: {
  icon: React.ElementType; title: string; description: string; children: React.ReactNode;
}) {
  return (
    <div className="panel-card p-5 space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="h-4.5 w-4.5 text-primary" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function ToggleRow({ label, description, checked, onChange }: {
  label: string; description: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-secondary/20 p-4">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
