import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2 } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DiscordLoginModal({ open, onClose, onSuccess }: Props) {
  const [step, setStep] = useState<"form" | "loading" | "success">("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) return;
    setStep("loading");
    setTimeout(() => {
      setStep("success");
      setTimeout(() => {
        onSuccess();
        // Reset for next open
        setStep("form");
        setEmail("");
        setPassword("");
      }, 1200);
    }, 1500);
  };

  const handleClose = () => {
    if (step === "loading") return;
    setStep("form");
    setEmail("");
    setPassword("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px] bg-[hsl(228,28%,8%)] border-[hsl(235,50%,30%)]/40 p-0 overflow-hidden">
        {/* Discord header bar */}
        <div className="bg-[hsl(235,86%,65%)] px-6 py-5">
          <div className="flex items-center gap-3">
            <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            <DialogTitle className="text-white text-lg font-bold">Login with Discord</DialogTitle>
          </div>
          <p className="text-white/70 text-sm mt-1">Sign in to authorize ShreeCloud</p>
        </div>

        <div className="px-6 py-5">
          {step === "form" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email or Phone Number</label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-10 bg-[hsl(228,20%,12%)] border-[hsl(228,16%,18%)] text-foreground"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-10 bg-[hsl(228,20%,12%)] border-[hsl(228,16%,18%)] text-foreground"
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
              <button className="text-xs text-[hsl(235,86%,65%)] hover:underline">Forgot your password?</button>
              <Button
                onClick={handleLogin}
                disabled={!email || !password}
                className="w-full h-10 bg-[hsl(235,86%,65%)] hover:bg-[hsl(235,86%,58%)] text-white font-medium"
              >
                Log In
              </Button>
              <p className="text-xs text-muted-foreground">
                Need an account? <span className="text-[hsl(235,86%,65%)] cursor-pointer hover:underline">Register</span>
              </p>
            </div>
          )}

          {step === "loading" && (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-[hsl(235,86%,65%)]" />
              <p className="text-sm text-muted-foreground">Authenticating with Discord...</p>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center">
                <CheckCircle2 className="h-7 w-7 text-success" />
              </div>
              <p className="text-sm font-medium text-foreground">Authorization successful!</p>
              <p className="text-xs text-muted-foreground">Redirecting to dashboard...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
