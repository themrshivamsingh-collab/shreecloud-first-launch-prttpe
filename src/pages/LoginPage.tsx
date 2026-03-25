import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, Loader2, Mail, KeyRound, Eye, EyeOff, Sparkles } from "lucide-react";
import scLogo from "@/assets/sc-logo.png";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { DiscordLoginModal } from "@/components/DiscordLoginModal";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [discordOpen, setDiscordOpen] = useState(false);
  const { login, loginWithDiscord } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      navigate("/servers");
    } catch {
      toast({ title: "Login failed", description: "Invalid credentials. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDiscordSuccess = async () => {
    try {
      await loginWithDiscord();
      setDiscordOpen(false);
      navigate("/servers");
    } catch {
      toast({ title: "Discord login failed", description: "Could not complete Discord authentication.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      {/* Ambient background */}
      <div className="ambient-bg" />
      <div className="noise-overlay" />

      {/* Left side — form */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm float-in">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="relative">
              <img src={scLogo} alt="ShreeCloud" className="h-10 w-10 rounded-xl ring-1 ring-primary/15" />
              <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success border-2 border-background" />
            </div>
            <div>
              <span className="font-bold text-foreground text-lg tracking-[-0.03em] lapsus-gradient-text">ShreeCloud</span>
              <span className="text-[10px] text-muted-foreground/40 block tracking-wide uppercase">Game Panel</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary/40" />
            <span className="text-[10px] font-semibold text-primary/50 uppercase tracking-[0.15em]">Welcome back</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1.5 tracking-[-0.03em]">Login to Continue</h1>
          <p className="text-sm text-muted-foreground/50 mb-8">Sign in to access your server panel</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs text-muted-foreground/60 font-medium">Username or Email</Label>
              <div className="relative premium-focus rounded-xl">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 pl-10 bg-card/40 border-border/40 backdrop-blur-sm rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs text-muted-foreground/60 font-medium">Password</Label>
                <button type="button" className="text-xs text-primary/60 hover:text-primary hover:underline transition-colors">Forgot password?</button>
              </div>
              <div className="relative premium-focus rounded-xl">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pl-10 pr-10 bg-card/40 border-border/40 backdrop-blur-sm rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 gap-2 font-semibold btn-glow rounded-xl text-sm tracking-wide" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
              Login
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/30" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 text-muted-foreground/30 tracking-widest text-[10px] font-medium">or continue with</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full h-12 gap-2.5 bg-[hsl(235,86%,65%)]/8 border-[hsl(235,86%,65%)]/20 text-foreground hover:bg-[hsl(235,86%,65%)]/15 hover:border-[hsl(235,86%,65%)]/30 btn-premium rounded-xl font-medium"
            onClick={() => setDiscordOpen(true)}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            Login with Discord
          </Button>

          <p className="text-center text-sm text-muted-foreground/40 mt-8">
            New here?{" "}
            <Link to="/register" className="text-primary/70 hover:text-primary hover:underline font-semibold text-xs tracking-wide uppercase transition-colors">
              Create an account
            </Link>
          </p>

          <p className="text-center text-[10px] text-muted-foreground/20 mt-12 tracking-wider">
            ShreeCloud Panel © 2024 – 2026
          </p>
        </div>
      </div>

      {/* Right side — gradient panel */}
      <div className="hidden lg:flex w-[45%] relative m-3 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-card to-card/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--glow-color)/0.3),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,hsl(var(--glow-secondary)/0.15),transparent_50%)]" />
        <div className="absolute inset-0 border border-border/20 rounded-2xl" />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />

        <div className="relative flex flex-col items-center justify-center w-full px-12">
          <div className="h-24 w-24 rounded-3xl bg-primary/10 backdrop-blur-xl flex items-center justify-center mx-auto mb-10 border border-primary/15 shadow-2xl shadow-primary/10">
            <img src={scLogo} alt="ShreeCloud" className="h-14 w-14 rounded-xl" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-3 tracking-[-0.03em]">ShreeCloud Panel</h2>
          <p className="text-foreground/40 text-sm max-w-xs mx-auto leading-relaxed text-center">
            Manage your game servers with a powerful, modern control panel built for performance.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mt-8 justify-center">
            {["Real-time Console", "File Manager", "One-Click Deploy"].map((f) => (
              <span key={f} className="text-[10px] px-3 py-1.5 rounded-full bg-primary/8 text-primary/60 border border-primary/10 font-medium tracking-wide">
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Discord Login Modal */}
      <DiscordLoginModal
        open={discordOpen}
        onClose={() => setDiscordOpen(false)}
        onSuccess={handleDiscordSuccess}
      />
    </div>
  );
}
