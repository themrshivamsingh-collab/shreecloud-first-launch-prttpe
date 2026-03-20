import { useState, useEffect } from "react";
import { Copy, Check, Link, Unlink, Save, KeyRound, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAccount } from "@/lib/pterodactyl";

export function AccountPage() {
  const { toast } = useToast();
  const [account, setAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    getAccount()
      .then((data) => setAccount(data))
      .catch((e) => toast({ title: "Error loading account", description: e.message, variant: "destructive" }))
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all";
  const labelClass = "block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5";
  const cardClass = "bg-card border border-border rounded-xl p-5 space-y-4";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Account</h1>
        <p className="text-sm text-muted-foreground mt-1">Your panel account information</p>
      </div>

      <div className={cardClass}>
        <h2 className="text-base font-semibold text-foreground">Profile</h2>
        <div className="space-y-3">
          <div>
            <label className={labelClass}>Username</label>
            <input value={account?.username || ""} readOnly className={`${inputClass} opacity-80 cursor-default`} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input value={account?.email || ""} readOnly className={`${inputClass} opacity-80 cursor-default`} />
          </div>
          <div>
            <label className={labelClass}>First Name</label>
            <input value={account?.first_name || ""} readOnly className={`${inputClass} opacity-80 cursor-default`} />
          </div>
          <div>
            <label className={labelClass}>Last Name</label>
            <input value={account?.last_name || ""} readOnly className={`${inputClass} opacity-80 cursor-default`} />
          </div>
          <div>
            <label className={labelClass}>Language</label>
            <input value={account?.language || ""} readOnly className={`${inputClass} opacity-80 cursor-default`} />
          </div>
          <div className="flex items-center gap-3">
            <label className={labelClass}>Admin</label>
            <span className={`text-sm font-medium ${account?.admin ? "text-success" : "text-muted-foreground"}`}>
              {account?.admin ? "Yes" : "No"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
