import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  Folder, File, FileText, FileCode, FileImage, FileArchive,
  ChevronLeft, Search, Upload, RefreshCw, Loader2,
  Package,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { listFiles, getFileContent } from "@/lib/pterodactyl";
import { useToast } from "@/hooks/use-toast";
import { Save, Check, X } from "lucide-react";

function formatSize(bytes: number): string {
  if (bytes === 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function getFileIcon(name: string, isFile: boolean) {
  if (!isFile) return Folder;
  const ext = name.split(".").pop()?.toLowerCase() || "";
  if (["yml", "yaml", "json", "properties", "txt", "log", "sh", "bat"].includes(ext)) return FileText;
  if (["js", "ts", "java", "py", "css", "html", "xml"].includes(ext)) return FileCode;
  if (["png", "jpg", "jpeg", "gif", "svg", "ico", "webp"].includes(ext)) return FileImage;
  if (["jar", "zip", "tar", "gz", "rar", "7z"].includes(ext)) return FileArchive;
  return File;
}

function isEditable(name: string): boolean {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  return ["yml", "yaml", "json", "properties", "txt", "log", "sh", "bat", "cfg", "conf", "ini", "toml", "xml", "html", "css", "js", "ts", "java", "py", "md"].includes(ext);
}

interface FilesPageProps {
  onOpenPluginsManager?: () => void;
}

export function FilesPage({ onOpenPluginsManager }: FilesPageProps) {
  const { serverId } = useParams();
  const { toast } = useToast();
  const [currentPath, setCurrentPath] = useState("/");
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editFile, setEditFile] = useState<{ name: string; content: string } | null>(null);

  const fetchFiles = useCallback(async (path: string) => {
    if (!serverId) return;
    setLoading(true);
    try {
      const files = await listFiles(serverId, path);
      setEntries(files);
    } catch (e: any) {
      toast({ title: "Error loading files", description: e.message, variant: "destructive" });
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [serverId]);

  useEffect(() => {
    fetchFiles(currentPath);
  }, [currentPath, fetchFiles]);

  const sorted = useMemo(() => {
    let list = [...entries];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((e) => e.name.toLowerCase().includes(q));
    }
    return list.sort((a: any, b: any) => {
      if (a.is_file !== b.is_file) return a.is_file ? 1 : -1;
      return a.name.localeCompare(b.name);
    });
  }, [entries, search]);

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    setSearch("");
  };

  const goBack = () => {
    const parts = currentPath.replace(/\/$/, "").split("/");
    parts.pop();
    const parent = parts.join("/") || "/";
    navigateTo(parent);
  };

  const openFolder = (name: string) => {
    const newPath = currentPath === "/" ? `/${name}` : `${currentPath}/${name}`;
    navigateTo(newPath);
  };

  const openFile = async (name: string) => {
    if (!serverId || !isEditable(name)) return;
    try {
      const filePath = currentPath === "/" ? `/${name}` : `${currentPath}/${name}`;
      const content = await getFileContent(serverId, filePath);
      // content might be a string or an object
      const text = typeof content === "string" ? content : JSON.stringify(content, null, 2);
      setEditFile({ name, content: text });
    } catch (e: any) {
      toast({ title: "Error reading file", description: e.message, variant: "destructive" });
    }
  };

  const canGoBack = currentPath !== "/";
  const pathParts = currentPath.split("/").filter(Boolean);

  // Editor view
  if (editFile) {
    return (
      <div className="space-y-4 max-w-6xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEditFile(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-card border border-border text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Back
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-foreground truncate">{editFile.name}</h1>
            <p className="text-xs text-muted-foreground font-mono truncate">{currentPath}/{editFile.name}</p>
          </div>
        </div>
        <textarea
          value={editFile.content}
          readOnly
          className="w-full h-[calc(100vh-200px)] rounded-xl border border-border bg-background p-4 text-sm text-foreground font-mono resize-none focus:outline-none terminal-scroll"
          spellCheck={false}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Files</h1>
          <p className="text-sm text-muted-foreground mt-1">Browse your server files</p>
        </div>
        <div className="flex items-center gap-2">
          {currentPath.includes("/plugins") && onOpenPluginsManager && (
            <button
              onClick={onOpenPluginsManager}
              className="btn-gradient flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
            >
              <Package className="h-4 w-4" /> Plugins Manager
            </button>
          )}
          <button
            onClick={() => fetchFiles(currentPath)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium panel-card text-muted-foreground hover:text-foreground transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground overflow-x-auto">
        <button onClick={() => navigateTo("/")} className="hover:text-foreground transition-colors shrink-0">/</button>
        {pathParts.map((part, i) => (
          <span key={i} className="flex items-center gap-1.5 shrink-0">
            <span className="text-border">/</span>
            <button
              onClick={() => navigateTo("/" + pathParts.slice(0, i + 1).join("/"))}
              className="hover:text-foreground transition-colors"
            >
              {part}
            </button>
          </span>
        ))}
      </div>

      {/* Search + Back */}
      <div className="flex items-center gap-3">
        {canGoBack && (
          <button onClick={goBack} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium panel-card text-muted-foreground hover:text-foreground transition-all">
            <ChevronLeft className="h-3.5 w-3.5" /> Back
          </button>
        )}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files..."
            className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      {/* File table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="ml-2 text-sm text-muted-foreground">Loading files...</span>
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Size</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Modified</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((entry) => {
                const Icon = getFileIcon(entry.name, entry.is_file);
                return (
                  <tr
                    key={entry.name}
                    className="border-b border-border/30 hover:bg-accent/40 transition-colors cursor-pointer"
                    onClick={() => entry.is_file ? openFile(entry.name) : openFolder(entry.name)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Icon className={`h-4 w-4 shrink-0 ${entry.is_file ? "text-muted-foreground" : "text-primary"}`} />
                        <span className="text-foreground truncate">{entry.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                      {entry.is_file ? formatSize(entry.size) : "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell text-xs">
                      {entry.modified_at ? new Date(entry.modified_at).toLocaleString() : "—"}
                    </td>
                  </tr>
                );
              })}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-12 text-center text-muted-foreground">
                    {search ? "No files match your search." : "This directory is empty."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
