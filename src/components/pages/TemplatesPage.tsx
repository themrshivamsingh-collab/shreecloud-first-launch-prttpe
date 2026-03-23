import { useState, useMemo } from "react";
import {
  LayoutTemplate, Plus, Search, Filter, Tag, User, Download,
  Eye, Pencil, Trash2, X, ChevronRight, Folder, File, FileText,
  FileCode, Image, Archive, Settings2, Globe, Star, Clock,
  Check, AlertTriangle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

/* ───── types ───── */
type PermLevel = "off" | "view" | "edit";

interface TemplateFile {
  name: string;
  type: "folder" | "file";
  size?: string;
  children?: TemplateFile[];
}

interface Template {
  id: string;
  name: string;
  description: string;
  version: string;
  tags: string[];
  creator: string;
  createdAt: string;
  downloads: number;
  rating: number;
  isMine: boolean;
  files: TemplateFile[];
}

/* ───── mock data ───── */
const MOCK_FILES: TemplateFile[] = [
  {
    name: "plugins", type: "folder", children: [
      { name: "EssentialsX.jar", type: "file", size: "4.2 MB" },
      { name: "LuckPerms.jar", type: "file", size: "2.1 MB" },
      { name: "Vault.jar", type: "file", size: "512 KB" },
      { name: "WorldEdit.jar", type: "file", size: "3.8 MB" },
    ]
  },
  {
    name: "config", type: "folder", children: [
      { name: "server.properties", type: "file", size: "1.2 KB" },
      { name: "bukkit.yml", type: "file", size: "856 B" },
      { name: "spigot.yml", type: "file", size: "1.4 KB" },
      { name: "paper.yml", type: "file", size: "2.1 KB" },
    ]
  },
  {
    name: "worlds", type: "folder", children: [
      { name: "world", type: "folder", children: [
        { name: "level.dat", type: "file", size: "4 KB" },
        { name: "region", type: "folder" },
      ]},
      { name: "world_nether", type: "folder" },
      { name: "world_the_end", type: "folder" },
    ]
  },
  { name: "server.jar", type: "file", size: "42 MB" },
  { name: "eula.txt", type: "file", size: "128 B" },
  { name: "start.sh", type: "file", size: "256 B" },
];

const INITIAL_TEMPLATES: Template[] = [
  {
    id: "1", name: "Survival SMP Starter", description: "A fully configured survival SMP setup with essential plugins, anti-cheat, and economy system. Perfect for starting a new survival community.",
    version: "1.20.4", tags: ["survival", "smp", "economy", "essentials"], creator: "ShreeCloud", createdAt: "2026-02-15", downloads: 1243, rating: 4.8, isMine: false, files: MOCK_FILES,
  },
  {
    id: "2", name: "PvP Arena Setup", description: "Complete PvP arena configuration with kit system, custom arenas, and leaderboard integration.",
    version: "1.20.4", tags: ["pvp", "arena", "competitive", "kits"], creator: "PvPMaster", createdAt: "2026-03-01", downloads: 856, rating: 4.5, isMine: false, files: MOCK_FILES,
  },
  {
    id: "3", name: "Creative Build Server", description: "Optimized creative server with WorldEdit, VoxelSniper, and plot management plugins pre-configured.",
    version: "1.20.4", tags: ["creative", "building", "worldedit", "plots"], creator: "BuilderPro", createdAt: "2026-03-10", downloads: 632, rating: 4.7, isMine: false, files: MOCK_FILES,
  },
  {
    id: "4", name: "My Custom Setup", description: "My personal server configuration with custom plugins and optimized settings.",
    version: "1.20.4", tags: ["custom", "optimized", "personal"], creator: "You", createdAt: "2026-03-20", downloads: 12, rating: 5.0, isMine: true, files: MOCK_FILES,
  },
  {
    id: "5", name: "Skyblock Adventure", description: "Feature-rich skyblock setup with custom islands, challenges, and shop system.",
    version: "1.20.2", tags: ["skyblock", "adventure", "islands", "challenges"], creator: "SkyMaster", createdAt: "2026-01-28", downloads: 2104, rating: 4.9, isMine: false, files: MOCK_FILES,
  },
  {
    id: "6", name: "Modded Performance Pack", description: "Lightweight modded server config with performance tweaks for 50+ players.",
    version: "1.19.4", tags: ["modded", "performance", "optimization"], creator: "You", createdAt: "2026-03-18", downloads: 45, rating: 4.2, isMine: true, files: MOCK_FILES,
  },
];

const ALL_TAGS = ["survival", "smp", "economy", "essentials", "pvp", "arena", "competitive", "kits", "creative", "building", "worldedit", "plots", "custom", "optimized", "skyblock", "adventure", "modded", "performance"];
const VERSIONS = ["1.20.4", "1.20.2", "1.19.4", "1.19.2"];
const SERVERS = ["Survival SMP", "Creative Hub", "PvP Network", "Testing Server"];

/* ───── helpers ───── */
const fileIcon = (f: TemplateFile) => {
  if (f.type === "folder") return <Folder className="h-4 w-4 text-primary" />;
  const ext = f.name.split(".").pop()?.toLowerCase();
  if (ext === "jar") return <Archive className="h-4 w-4 text-orange-400" />;
  if (ext === "yml" || ext === "yaml" || ext === "properties") return <Settings2 className="h-4 w-4 text-emerald-400" />;
  if (ext === "json") return <FileCode className="h-4 w-4 text-yellow-400" />;
  if (ext === "png" || ext === "jpg") return <Image className="h-4 w-4 text-pink-400" />;
  if (ext === "sh") return <FileText className="h-4 w-4 text-cyan-400" />;
  return <File className="h-4 w-4 text-muted-foreground" />;
};

/* ───── sub-components ───── */

function FileTree({ files, depth = 0 }: { files: TemplateFile[]; depth?: number }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  return (
    <div className="space-y-0.5">
      {files.map((f) => (
        <div key={f.name}>
          <button
            onClick={() => f.type === "folder" && setExpanded(p => ({ ...p, [f.name]: !p[f.name] }))}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-secondary/60 text-sm transition-colors group"
            style={{ paddingLeft: `${depth * 16 + 8}px` }}
          >
            {f.type === "folder" && (
              <ChevronRight className={`h-3 w-3 text-muted-foreground transition-transform ${expanded[f.name] ? "rotate-90" : ""}`} />
            )}
            {f.type !== "folder" && <span className="w-3" />}
            {fileIcon(f)}
            <span className="text-foreground truncate">{f.name}</span>
            {f.size && <span className="ml-auto text-[11px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">{f.size}</span>}
          </button>
          {f.type === "folder" && expanded[f.name] && f.children && (
            <FileTree files={f.children} depth={depth + 1} />
          )}
        </div>
      ))}
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`h-3 w-3 ${i <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"}`} />
      ))}
      <span className="text-[11px] text-muted-foreground ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

/* ───── main component ───── */
export function TemplatesPage() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>(INITIAL_TEMPLATES);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "mine" | "community">("all");
  const [filterVersion, setFilterVersion] = useState<string>("all");
  const [filterTag, setFilterTag] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // modals
  const [createOpen, setCreateOpen] = useState(false);
  const [detailTemplate, setDetailTemplate] = useState<Template | null>(null);
  const [editTemplate, setEditTemplate] = useState<Template | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [applyId, setApplyId] = useState<string | null>(null);
  const [applyServer, setApplyServer] = useState("");

  // create form
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formVersion, setFormVersion] = useState("1.20.4");
  const [formTags, setFormTags] = useState("");
  const [formServer, setFormServer] = useState("");

  const filtered = useMemo(() => {
    let list = templates;
    if (tab === "mine") list = list.filter(t => t.isMine);
    if (tab === "community") list = list.filter(t => !t.isMine);
    if (filterVersion !== "all") list = list.filter(t => t.version === filterVersion);
    if (filterTag !== "all") list = list.filter(t => t.tags.includes(filterTag));
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.includes(q)) ||
        t.creator.toLowerCase().includes(q)
      );
    }
    return list;
  }, [templates, tab, filterVersion, filterTag, search]);

  const resetForm = () => {
    setFormName(""); setFormDesc(""); setFormVersion("1.20.4"); setFormTags(""); setFormServer("");
  };

  const handleCreate = () => {
    if (!formName.trim()) { toast({ title: "Error", description: "Template name is required", variant: "destructive" }); return; }
    const newT: Template = {
      id: Date.now().toString(), name: formName.trim(), description: formDesc.trim(),
      version: formVersion, tags: formTags.split(",").map(t => t.trim().toLowerCase()).filter(Boolean),
      creator: "You", createdAt: new Date().toISOString().split("T")[0],
      downloads: 0, rating: 5.0, isMine: true, files: MOCK_FILES,
    };
    setTemplates(prev => [newT, ...prev]);
    setCreateOpen(false); resetForm();
    toast({ title: "Template Created", description: `"${newT.name}" has been saved successfully.` });
  };

  const handleEdit = () => {
    if (!editTemplate || !formName.trim()) return;
    setTemplates(prev => prev.map(t => t.id === editTemplate.id ? {
      ...t, name: formName.trim(), description: formDesc.trim(), version: formVersion,
      tags: formTags.split(",").map(tg => tg.trim().toLowerCase()).filter(Boolean),
    } : t));
    setEditTemplate(null); resetForm();
    toast({ title: "Template Updated", description: "Changes saved successfully." });
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setTemplates(prev => prev.filter(t => t.id !== deleteId));
    setDeleteId(null);
    toast({ title: "Template Deleted", description: "The template has been removed." });
  };

  const handleApply = () => {
    if (!applyServer) { toast({ title: "Error", description: "Please select a server", variant: "destructive" }); return; }
    setApplyId(null); setApplyServer("");
    toast({ title: "Template Applied", description: `Template applied to "${applyServer}" successfully.` });
  };

  const openEdit = (t: Template) => {
    setFormName(t.name); setFormDesc(t.description); setFormVersion(t.version);
    setFormTags(t.tags.join(", ")); setFormServer("");
    setEditTemplate(t);
  };

  const tabs = [
    { key: "all" as const, label: "All Templates", count: templates.length },
    { key: "mine" as const, label: "My Templates", count: templates.filter(t => t.isMine).length },
    { key: "community" as const, label: "Community", count: templates.filter(t => !t.isMine).length },
  ];

  return (
    <div className="space-y-5 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <LayoutTemplate className="h-5 w-5 text-primary" />
            Templates
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Create, share, and apply server templates</p>
        </div>
        <Button onClick={() => { resetForm(); setCreateOpen(true); }} className="btn-gradient gap-2 shrink-0">
          <Plus className="h-4 w-4" /> Create Template
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-secondary/40 border border-border/60 w-fit">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              tab === t.key ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            }`}
          >
            {t.label}
            <span className={`ml-1.5 px-1.5 py-0.5 rounded-md text-[10px] ${
              tab === t.key ? "bg-primary-foreground/20" : "bg-secondary"
            }`}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates by name, tag, or creator..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="pl-10 bg-secondary/40 border-border/60"
          />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="gap-2 shrink-0">
          <Filter className="h-4 w-4" /> Filters
          {(filterVersion !== "all" || filterTag !== "all") && (
            <span className="h-2 w-2 rounded-full bg-primary" />
          )}
        </Button>
      </div>

      {showFilters && (
        <div className="panel-card p-4 flex flex-wrap gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-1.5 min-w-[160px]">
            <Label className="text-xs text-muted-foreground">Version</Label>
            <Select value={filterVersion} onValueChange={setFilterVersion}>
              <SelectTrigger className="bg-secondary/40 border-border/60 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Versions</SelectItem>
                {VERSIONS.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 min-w-[160px]">
            <Label className="text-xs text-muted-foreground">Tag</Label>
            <Select value={filterTag} onValueChange={setFilterTag}>
              <SelectTrigger className="bg-secondary/40 border-border/60 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {ALL_TAGS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {(filterVersion !== "all" || filterTag !== "all") && (
            <Button variant="ghost" size="sm" className="self-end text-xs text-muted-foreground" onClick={() => { setFilterVersion("all"); setFilterTag("all"); }}>
              Clear filters
            </Button>
          )}
        </div>
      )}

      {/* Template Grid */}
      {filtered.length === 0 ? (
        <div className="panel-card p-12 text-center">
          <LayoutTemplate className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-foreground font-medium">No templates found</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(t => (
            <div key={t.id} className="panel-card p-0 overflow-hidden group hover:border-primary/30 transition-all duration-300">
              {/* Card header accent */}
              <div className="h-1 bg-gradient-to-r from-primary via-primary/60 to-transparent" />
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground text-sm truncate">{t.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <User className="h-3 w-3" /> {t.creator}
                      </span>
                      <span className="text-[11px] text-muted-foreground">v{t.version}</span>
                    </div>
                  </div>
                  {t.isMine && (
                    <Badge variant="outline" className="text-[10px] border-primary/30 text-primary shrink-0">Mine</Badge>
                  )}
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{t.description}</p>

                <div className="flex flex-wrap gap-1.5">
                  {t.tags.slice(0, 4).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0.5 bg-secondary/60">
                      <Tag className="h-2.5 w-2.5 mr-1" />{tag}
                    </Badge>
                  ))}
                  {t.tags.length > 4 && (
                    <Badge variant="secondary" className="text-[10px] px-2 py-0.5 bg-secondary/60">+{t.tags.length - 4}</Badge>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-border/40">
                  <div className="flex items-center gap-3">
                    <StarRating rating={t.rating} />
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Download className="h-3 w-3" /> {t.downloads}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {t.createdAt}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <Button size="sm" className="btn-gradient flex-1 h-8 text-xs gap-1.5" onClick={() => { setApplyId(t.id); setApplyServer(""); }}>
                    <Download className="h-3 w-3" /> Apply
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => setDetailTemplate(t)}>
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  {t.isMine && (
                    <>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => openEdit(t)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-destructive hover:text-destructive" onClick={() => setDeleteId(t.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ───── Detail Modal ───── */}
      <Dialog open={!!detailTemplate} onOpenChange={() => setDetailTemplate(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LayoutTemplate className="h-5 w-5 text-primary" />
              {detailTemplate?.name}
            </DialogTitle>
            <DialogDescription className="sr-only">Template details and file structure</DialogDescription>
          </DialogHeader>
          {detailTemplate && (
            <div className="space-y-5">
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <User className="h-4 w-4" /> {detailTemplate.creator}
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Globe className="h-4 w-4" /> v{detailTemplate.version}
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Download className="h-4 w-4" /> {detailTemplate.downloads} downloads
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-4 w-4" /> {detailTemplate.createdAt}
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">{detailTemplate.description}</p>

              <div className="flex flex-wrap gap-1.5">
                {detailTemplate.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs"><Tag className="h-3 w-3 mr-1" />{tag}</Badge>
                ))}
              </div>

              <StarRating rating={detailTemplate.rating} />

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Folder className="h-4 w-4 text-primary" /> File Structure
                </h4>
                <div className="rounded-xl bg-secondary/30 border border-border/60 p-3 max-h-[300px] overflow-y-auto terminal-scroll">
                  <FileTree files={detailTemplate.files} />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button className="btn-gradient flex-1 gap-2" onClick={() => { setDetailTemplate(null); setApplyId(detailTemplate.id); setApplyServer(""); }}>
                  <Download className="h-4 w-4" /> Apply Template
                </Button>
                {detailTemplate.isMine && (
                  <Button variant="outline" className="gap-2" onClick={() => { setDetailTemplate(null); openEdit(detailTemplate); }}>
                    <Pencil className="h-4 w-4" /> Edit
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ───── Create / Edit Modal ───── */}
      <Dialog open={createOpen || !!editTemplate} onOpenChange={() => { setCreateOpen(false); setEditTemplate(null); resetForm(); }}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              {editTemplate ? "Edit Template" : "Create Template"}
            </DialogTitle>
            <DialogDescription className="sr-only">{editTemplate ? "Edit your template" : "Create a new template"}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Template Name *</Label>
              <Input value={formName} onChange={e => setFormName(e.target.value)} placeholder="e.g. My SMP Setup" className="bg-secondary/40 border-border/60" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Description</Label>
              <Textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} placeholder="Describe what this template includes..." className="bg-secondary/40 border-border/60 min-h-[80px]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Version</Label>
                <Select value={formVersion} onValueChange={setFormVersion}>
                  <SelectTrigger className="bg-secondary/40 border-border/60"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {VERSIONS.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Source Server</Label>
                <Select value={formServer} onValueChange={setFormServer}>
                  <SelectTrigger className="bg-secondary/40 border-border/60"><SelectValue placeholder="Select server" /></SelectTrigger>
                  <SelectContent>
                    {SERVERS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Tags (comma-separated)</Label>
              <Input value={formTags} onChange={e => setFormTags(e.target.value)} placeholder="survival, smp, economy" className="bg-secondary/40 border-border/60" />
            </div>

            {formServer && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <Label className="text-xs flex items-center gap-2">
                  <Folder className="h-3.5 w-3.5 text-primary" /> Server Files Preview
                </Label>
                <div className="rounded-xl bg-secondary/30 border border-border/60 p-3 max-h-[200px] overflow-y-auto terminal-scroll">
                  <FileTree files={MOCK_FILES} />
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => { setCreateOpen(false); setEditTemplate(null); resetForm(); }}>Cancel</Button>
            <Button className="btn-gradient gap-2" onClick={editTemplate ? handleEdit : handleCreate}>
              <Check className="h-4 w-4" /> {editTemplate ? "Save Changes" : "Create Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ───── Apply Modal ───── */}
      <Dialog open={!!applyId} onOpenChange={() => { setApplyId(null); setApplyServer(""); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" /> Apply Template
            </DialogTitle>
            <DialogDescription>Select a server to apply this template to. This will overwrite existing files.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-xs text-yellow-400">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Applying a template will overwrite existing server files.</span>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Target Server</Label>
              <Select value={applyServer} onValueChange={setApplyServer}>
                <SelectTrigger className="bg-secondary/40 border-border/60"><SelectValue placeholder="Select server" /></SelectTrigger>
                <SelectContent>
                  {SERVERS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => { setApplyId(null); setApplyServer(""); }}>Cancel</Button>
            <Button className="btn-gradient gap-2" onClick={handleApply}>
              <Check className="h-4 w-4" /> Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ───── Delete Confirmation ───── */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this template? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
