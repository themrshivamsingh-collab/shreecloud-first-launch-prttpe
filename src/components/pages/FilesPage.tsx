import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Folder, File, FileText, FileCode, FileImage, FileArchive,
  ChevronLeft, Search, Upload, RefreshCw, Loader2,
  Package, Plus, FolderPlus, Trash2, Edit3, Download,
  MoreVertical, Copy, Scissors, ClipboardPaste,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { listFiles, getFileContent } from "@/lib/pterodactyl";
import { useAuth } from "@/contexts/AuthContext";
import { getMockFiles, getMockFileContent, MOCK_FILE_SYSTEM, type MockFile } from "@/lib/mockData";
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
  if (["yml", "yaml", "json", "properties", "txt", "log", "sh", "bat", "cfg", "conf", "ini", "toml"].includes(ext)) return FileText;
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
  const { isDemoMode } = useAuth();
  const { toast } = useToast();
  const [currentPath, setCurrentPath] = useState("/");
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editFile, setEditFile] = useState<{ name: string; content: string; path: string } | null>(null);
  const [editContent, setEditContent] = useState("");
  const [saved, setSaved] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; entry: any } | null>(null);
  const [showNewFile, setShowNewFile] = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newName, setNewName] = useState("");
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameName, setRenameName] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchFiles = useCallback(async (path: string) => {
    setLoading(true);
    if (isDemoMode) {
      await new Promise(r => setTimeout(r, 300));
      const files = getMockFiles(path);
      setEntries(files.map(f => ({
        name: f.name,
        is_file: f.is_file,
        size: f.size,
        modified_at: f.modified_at,
      })));
      setLoading(false);
      return;
    }
    if (!serverId) return;
    try {
      const files = await listFiles(serverId, path);
      setEntries(files);
    } catch (e: any) {
      toast({ title: "Error loading files", description: e.message, variant: "destructive" });
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [serverId, isDemoMode]);

  useEffect(() => {
    fetchFiles(currentPath);
  }, [currentPath, fetchFiles]);

  // Close context menu on click outside
  useEffect(() => {
    const handler = () => setContextMenu(null);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

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
    if (!isEditable(name)) {
      toast({ title: "Cannot open file", description: "This file type cannot be viewed in the editor.", variant: "destructive" });
      return;
    }
    const filePath = currentPath === "/" ? `/${name}` : `${currentPath}/${name}`;
    if (isDemoMode) {
      const content = getMockFileContent(filePath);
      setEditFile({ name, content, path: filePath });
      setEditContent(content);
      return;
    }
    if (!serverId) return;
    try {
      const content = await getFileContent(serverId, filePath);
      const text = typeof content === "string" ? content : JSON.stringify(content, null, 2);
      setEditFile({ name, content: text, path: filePath });
      setEditContent(text);
    } catch (e: any) {
      toast({ title: "Error reading file", description: e.message, variant: "destructive" });
    }
  };

  const handleSave = () => {
    if (!editFile) return;
    // In demo mode just show success
    setSaved(true);
    if (editFile) editFile.content = editContent;
    toast({ title: "File saved", description: `${editFile.name} has been saved successfully.` });
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCreateFile = () => {
    if (!newName.trim()) return;
    setEntries(prev => [...prev, { name: newName.trim(), is_file: true, size: 0, modified_at: new Date().toISOString() }]);
    toast({ title: "File created", description: `${newName.trim()} has been created.` });
    setNewName("");
    setShowNewFile(false);
  };

  const handleCreateFolder = () => {
    if (!newName.trim()) return;
    setEntries(prev => [...prev, { name: newName.trim(), is_file: false, size: 0, modified_at: new Date().toISOString() }]);
    toast({ title: "Folder created", description: `${newName.trim()} has been created.` });
    setNewName("");
    setShowNewFolder(false);
  };

  const handleRename = (oldName: string) => {
    if (!renameName.trim()) return;
    setEntries(prev => prev.map(e => e.name === oldName ? { ...e, name: renameName.trim() } : e));
    toast({ title: "Renamed", description: `${oldName} → ${renameName.trim()}` });
    setRenaming(null);
    setRenameName("");
  };

  const handleDelete = (name: string) => {
    setEntries(prev => prev.filter(e => e.name !== name));
    toast({ title: "Deleted", description: `${name} has been deleted.` });
    setDeleteConfirm(null);
  };

  const handleContextMenu = (e: React.MouseEvent, entry: any) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, entry });
  };

  const canGoBack = currentPath !== "/";
  const pathParts = currentPath.split("/").filter(Boolean);

  // Editor view
  if (editFile) {
    const hasChanges = editContent !== editFile.content;
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
            <h1 className="text-lg font-bold text-foreground truncate flex items-center gap-2">
              {editFile.name}
              {hasChanges && <span className="text-xs text-primary font-normal">(unsaved)</span>}
            </h1>
            <p className="text-xs text-muted-foreground font-mono truncate">{editFile.path}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={!hasChanges && !saved}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                saved
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : hasChanges
                  ? "btn-gradient"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              {saved ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
              {saved ? "Saved" : "Save"}
            </button>
          </div>
        </div>
        <div className="panel-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-muted/30">
            <span className="text-xs text-muted-foreground font-mono">{editFile.name}</span>
            <span className="text-xs text-muted-foreground">{editContent.split('\n').length} lines</span>
          </div>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full h-[calc(100vh-260px)] bg-background p-4 text-sm text-foreground font-mono resize-none focus:outline-none terminal-scroll"
            spellCheck={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-6xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Files</h1>
          <p className="text-sm text-muted-foreground mt-1">Browse and manage your server files</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {currentPath.includes("/plugins") && onOpenPluginsManager && (
            <button
              onClick={onOpenPluginsManager}
              className="btn-gradient flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
            >
              <Package className="h-4 w-4" /> Plugins Manager
            </button>
          )}
          <button
            onClick={() => { setShowNewFile(true); setShowNewFolder(false); setNewName(""); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium panel-card text-muted-foreground hover:text-foreground transition-all"
          >
            <Plus className="h-3.5 w-3.5" /> New File
          </button>
          <button
            onClick={() => { setShowNewFolder(true); setShowNewFile(false); setNewName(""); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium panel-card text-muted-foreground hover:text-foreground transition-all"
          >
            <FolderPlus className="h-3.5 w-3.5" /> New Folder
          </button>
          <button
            onClick={() => fetchFiles(currentPath)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium panel-card text-muted-foreground hover:text-foreground transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* New File / Folder Input */}
      {(showNewFile || showNewFolder) && (
        <div className="panel-card p-4 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            {showNewFile ? <File className="h-4 w-4 text-primary" /> : <Folder className="h-4 w-4 text-primary" />}
          </div>
          <input
            autoFocus
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") showNewFile ? handleCreateFile() : handleCreateFolder();
              if (e.key === "Escape") { setShowNewFile(false); setShowNewFolder(false); }
            }}
            placeholder={showNewFile ? "filename.txt" : "folder-name"}
            className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={() => showNewFile ? handleCreateFile() : handleCreateFolder()}
            className="btn-gradient px-4 py-2 rounded-lg text-xs font-semibold"
          >
            Create
          </button>
          <button
            onClick={() => { setShowNewFile(false); setShowNewFolder(false); }}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

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
            className="w-full rounded-xl border border-border bg-background pl-9 pr-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
        </div>
      </div>

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="panel-card p-4 border-destructive/50 bg-destructive/5 flex items-center justify-between">
          <p className="text-sm text-foreground">
            Are you sure you want to delete <strong>{deleteConfirm}</strong>?
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              Cancel
            </button>
            <button onClick={() => handleDelete(deleteConfirm)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors">
              Delete
            </button>
          </div>
        </div>
      )}

      {/* File table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="ml-2 text-sm text-muted-foreground">Loading files...</span>
        </div>
      ) : (
        <div className="panel-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Size</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Modified</th>
                <th className="w-12 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((entry) => {
                const Icon = getFileIcon(entry.name, entry.is_file);
                const isRenamingThis = renaming === entry.name;
                return (
                  <tr
                    key={entry.name}
                    className="border-b border-border/30 hover:bg-accent/40 transition-colors cursor-pointer group"
                    onClick={() => {
                      if (isRenamingThis) return;
                      entry.is_file ? openFile(entry.name) : openFolder(entry.name);
                    }}
                    onContextMenu={(e) => handleContextMenu(e, entry)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Icon className={`h-4 w-4 shrink-0 ${entry.is_file ? "text-muted-foreground" : "text-primary"}`} />
                        {isRenamingThis ? (
                          <input
                            autoFocus
                            value={renameName}
                            onChange={e => setRenameName(e.target.value)}
                            onKeyDown={e => {
                              e.stopPropagation();
                              if (e.key === "Enter") handleRename(entry.name);
                              if (e.key === "Escape") { setRenaming(null); setRenameName(""); }
                            }}
                            onClick={e => e.stopPropagation()}
                            className="bg-background border border-border rounded px-2 py-0.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        ) : (
                          <span className="text-foreground truncate">{entry.name}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                      {entry.is_file ? formatSize(entry.size) : "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell text-xs">
                      {entry.modified_at ? new Date(entry.modified_at).toLocaleString() : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleContextMenu(e, entry); }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-accent/60 transition-all"
                      >
                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">
                    {search ? "No files match your search." : "This directory is empty."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed z-50 min-w-[180px] rounded-xl border border-border bg-card shadow-xl py-1.5 animate-in fade-in zoom-in-95"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={e => e.stopPropagation()}
        >
          {contextMenu.entry.is_file && isEditable(contextMenu.entry.name) && (
            <button
              onClick={() => { openFile(contextMenu.entry.name); setContextMenu(null); }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-foreground hover:bg-accent/50 transition-colors"
            >
              <Edit3 className="h-3.5 w-3.5" /> Edit
            </button>
          )}
          <button
            onClick={() => {
              setRenaming(contextMenu.entry.name);
              setRenameName(contextMenu.entry.name);
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-foreground hover:bg-accent/50 transition-colors"
          >
            <Edit3 className="h-3.5 w-3.5" /> Rename
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(contextMenu.entry.name);
              toast({ title: "Copied", description: "File name copied to clipboard." });
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-foreground hover:bg-accent/50 transition-colors"
          >
            <Copy className="h-3.5 w-3.5" /> Copy Name
          </button>
          <button
            onClick={() => {
              toast({ title: "Download started", description: `Downloading ${contextMenu.entry.name}...` });
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-foreground hover:bg-accent/50 transition-colors"
          >
            <Download className="h-3.5 w-3.5" /> Download
          </button>
          <div className="my-1 border-t border-border/50" />
          <button
            onClick={() => { setDeleteConfirm(contextMenu.entry.name); setContextMenu(null); }}
            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}
