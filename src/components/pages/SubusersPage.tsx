import { useState } from "react";
import { UserPlus, Shield, Trash2, Edit3, X, ChevronDown, ChevronUp, Search, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/* ── Permission Types ── */
type PermLevel = "off" | "view" | "edit";

interface PermissionItem {
  key: string;
  label: string;
}

interface PermissionGroup {
  label: string;
  icon: string;
  items: PermissionItem[];
}

const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    label: "Server Core",
    icon: "🖥️",
    items: [
      { key: "dashboard", label: "Dashboard" },
      { key: "console", label: "Console" },
      { key: "power", label: "Start / Stop / Restart" },
    ],
  },
  {
    label: "File System",
    icon: "📁",
    items: [
      { key: "files.view", label: "View Files" },
      { key: "files.edit", label: "Edit Files" },
      { key: "files.upload", label: "Upload Files" },
      { key: "files.delete", label: "Delete Files" },
      { key: "files.rename", label: "Rename Files" },
    ],
  },
  {
    label: "Content",
    icon: "🧩",
    items: [
      { key: "plugins", label: "Plugins" },
      { key: "mods", label: "Mods" },
      { key: "worlds", label: "Worlds" },
    ],
  },
  {
    label: "Configuration",
    icon: "⚙️",
    items: [
      { key: "settings", label: "Settings" },
      { key: "server_properties", label: "Server Properties" },
      { key: "versions", label: "Versions" },
    ],
  },
  {
    label: "Players",
    icon: "👤",
    items: [
      { key: "players.view", label: "View Players" },
      { key: "players.ban", label: "Ban Players" },
      { key: "players.op", label: "OP Players" },
      { key: "players.whitelist", label: "Whitelist" },
    ],
  },
  {
    label: "Data",
    icon: "💾",
    items: [
      { key: "backups", label: "Backups" },
      { key: "logs", label: "Logs" },
      { key: "crash_reports", label: "Crash Reports" },
    ],
  },
  {
    label: "Customization",
    icon: "🎨",
    items: [
      { key: "motd", label: "MOTD" },
      { key: "icon", label: "Server Icon" },
      { key: "resource_packs", label: "Resource Packs" },
    ],
  },
  {
    label: "Admin",
    icon: "🔑",
    items: [
      { key: "subusers", label: "Subusers" },
      { key: "permissions", label: "Permissions" },
    ],
  },
];

function getDefaultPerms(): Record<string, PermLevel> {
  const perms: Record<string, PermLevel> = {};
  PERMISSION_GROUPS.forEach((g) => g.items.forEach((i) => { perms[i.key] = "off"; }));
  return perms;
}

interface Subuser {
  id: string;
  username: string;
  email: string;
  permissions: Record<string, PermLevel>;
  createdAt: string;
}

const MOCK_SUBUSERS: Subuser[] = [
  {
    id: "1",
    username: "ModeratorSteve",
    email: "steve@example.com",
    permissions: {
      ...getDefaultPerms(),
      dashboard: "view",
      console: "view",
      power: "off",
      "files.view": "view",
      plugins: "view",
      "players.view": "view",
      "players.ban": "edit",
    },
    createdAt: "2025-12-15",
  },
  {
    id: "2",
    username: "BuilderAlex",
    email: "alex@example.com",
    permissions: {
      ...getDefaultPerms(),
      dashboard: "view",
      console: "off",
      "files.view": "view",
      "files.edit": "edit",
      "files.upload": "edit",
      worlds: "edit",
    },
    createdAt: "2026-01-20",
  },
];

/* ── Segmented Toggle ── */
function PermToggle({ value, onChange }: { value: PermLevel; onChange: (v: PermLevel) => void }) {
  const levels: PermLevel[] = ["off", "view", "edit"];
  return (
    <div className="segmented-control">
      {levels.map((l) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          className={value === l ? `active-${l}` : ""}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

/* ── Permission summary ── */
function getPermSummary(perms: Record<string, PermLevel>): string {
  const editCount = Object.values(perms).filter((v) => v === "edit").length;
  const viewCount = Object.values(perms).filter((v) => v === "view").length;
  const total = Object.keys(perms).length;
  if (editCount === 0 && viewCount === 0) return "No permissions";
  return `${editCount + viewCount}/${total} active`;
}

/* ── Main Component ── */
export function SubusersPage() {
  const { toast } = useToast();
  const [subusers, setSubusers] = useState<Subuser[]>(MOCK_SUBUSERS);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Subuser | null>(null);
  const [creating, setCreating] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPerms, setNewPerms] = useState<Record<string, PermLevel>>(getDefaultPerms());
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const filtered = subusers.filter(
    (s) =>
      s.username.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleCreate = () => {
    if (!newUsername.trim() || !newEmail.trim()) {
      toast({ title: "Error", description: "Username and email are required.", variant: "destructive" });
      return;
    }
    const sub: Subuser = {
      id: Date.now().toString(),
      username: newUsername.trim(),
      email: newEmail.trim(),
      permissions: { ...newPerms },
      createdAt: new Date().toISOString().split("T")[0],
    };
    setSubusers((prev) => [...prev, sub]);
    setCreating(false);
    setNewUsername("");
    setNewEmail("");
    setNewPerms(getDefaultPerms());
    toast({ title: "Subuser created", description: `${sub.username} has been added.` });
  };

  const handleDelete = (id: string) => {
    const user = subusers.find((s) => s.id === id);
    setSubusers((prev) => prev.filter((s) => s.id !== id));
    if (editing?.id === id) setEditing(null);
    toast({ title: "Subuser removed", description: `${user?.username} has been removed.` });
  };

  const handleSaveEdit = () => {
    if (!editing) return;
    setSubusers((prev) => prev.map((s) => (s.id === editing.id ? editing : s)));
    setEditing(null);
    toast({ title: "Permissions updated", description: `${editing.username}'s permissions have been saved.` });
  };

  const updateEditPerm = (key: string, val: PermLevel) => {
    if (!editing) return;
    const updated = { ...editing.permissions, [key]: val };
    // EDIT requires VIEW — if setting to edit, also set view-dependent perms
    if (val === "edit") {
      // No auto-cascade needed since edit implies view
    }
    // OFF disables all
    if (val === "off") {
      // Just set off
    }
    setEditing({ ...editing, permissions: updated });
  };

  const updateNewPerm = (key: string, val: PermLevel) => {
    setNewPerms((prev) => ({ ...prev, [key]: val }));
  };

  /* ── Permission Editor ── */
  const renderPermEditor = (
    perms: Record<string, PermLevel>,
    onUpdate: (key: string, val: PermLevel) => void
  ) => (
    <div className="space-y-2">
      {PERMISSION_GROUPS.map((group) => {
        const isOpen = expandedGroups[group.label] !== false;
        const activeCount = group.items.filter((i) => perms[i.key] !== "off").length;
        return (
          <div key={group.label} className="panel-card overflow-hidden">
            <button
              onClick={() => toggleGroup(group.label)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-accent/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{group.icon}</span>
                <span className="text-sm font-semibold text-foreground">{group.label}</span>
                {activeCount > 0 && (
                  <span className="text-[10px] font-semibold bg-primary/15 text-primary px-2 py-0.5 rounded-full">
                    {activeCount}/{group.items.length}
                  </span>
                )}
              </div>
              {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>
            {isOpen && (
              <div className="border-t border-border/40 px-4 py-2 space-y-1">
                {group.items.map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-accent/20 transition-colors">
                    <span className="text-sm text-foreground">{item.label}</span>
                    <PermToggle value={perms[item.key] || "off"} onChange={(v) => onUpdate(item.key, v)} />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  /* ── Edit Modal ── */
  if (editing) {
    return (
      <div className="space-y-5 max-w-4xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEditing(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium panel-card text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3.5 w-3.5" /> Cancel
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-foreground">Edit Permissions</h1>
            <p className="text-sm text-muted-foreground">{editing.username} — {editing.email}</p>
          </div>
          <button onClick={handleSaveEdit} className="btn-gradient px-5 py-2.5 rounded-xl text-sm font-semibold">
            Save Changes
          </button>
        </div>
        {renderPermEditor(editing.permissions, updateEditPerm)}
      </div>
    );
  }

  /* ── Create Modal ── */
  if (creating) {
    return (
      <div className="space-y-5 max-w-4xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCreating(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium panel-card text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3.5 w-3.5" /> Cancel
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-foreground">Create Subuser</h1>
            <p className="text-sm text-muted-foreground">Add a new user with specific permissions</p>
          </div>
          <button onClick={handleCreate} className="btn-gradient px-5 py-2.5 rounded-xl text-sm font-semibold">
            Create Subuser
          </button>
        </div>

        {/* User Info */}
        <div className="panel-card p-5 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">User Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Username</label>
              <input
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</label>
              <input
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>
          </div>
        </div>

        {/* Permissions */}
        <h2 className="text-sm font-semibold text-foreground">Permissions</h2>
        {renderPermEditor(newPerms, updateNewPerm)}
      </div>
    );
  }

  /* ── Main List ── */
  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Subusers</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage server access and permissions</p>
        </div>
        <button
          onClick={() => { setCreating(true); setExpandedGroups({}); }}
          className="btn-gradient flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
        >
          <UserPlus className="h-4 w-4" /> Create Subuser
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search subusers..."
          className="w-full panel-card pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
        />
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="panel-card flex flex-col items-center justify-center py-16">
          <Users className="h-12 w-12 text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground font-medium">
            {search ? "No subusers match your search" : "No subusers yet"}
          </p>
          {!search && (
            <p className="text-xs text-muted-foreground/60 mt-1">Click "Create Subuser" to add one</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((sub) => (
            <div key={sub.id} className="panel-card p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Avatar + Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold lapsus-gradient-text">{sub.username[0].toUpperCase()}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-foreground truncate">{sub.username}</h3>
                  <p className="text-xs text-muted-foreground truncate">{sub.email}</p>
                </div>
              </div>

              {/* Permission Summary */}
              <div className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs text-muted-foreground font-medium">{getPermSummary(sub.permissions)}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => { setEditing(sub); setExpandedGroups({}); }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(sub.id)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
