import { useState, useEffect } from "react";
import { Copy, Check, Loader2 } from "lucide-react";
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const fields = [
    { label: "Username", value: account?.username || "" },
    { label: "Email", value: account?.email || "" },
    { label: "First Name", value: account?.first_name || "" },
    { label: "Last Name", value: account?.last_name || "" },
    { label: "Language", value: account?.language || "" },
  ];

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">Account</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Your panel account information</p>
      </div>

      <div className="panel-card p-5 space-y-5">
        <h2 className="text-base font-semibold text-foreground">Profile</h2>
        <div className="space-y-3">
          {fields.map((f) => (
            <div key={f.label} className="space-y-1.5">
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider">{f.label}</label>
              <input
                value={f.value}
                readOnly
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground opacity-80 cursor-default focus:outline-none"
              />
            </div>
          ))}
          <div className="flex items-center gap-3 pt-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Admin</label>
            <span className={`text-sm font-medium ${account?.admin ? "text-success" : "text-muted-foreground"}`}>
              {account?.admin ? "Yes" : "No"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
