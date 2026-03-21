import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type User = {
  id: string;
  email: string;
  username: string;
  isDiscord?: boolean;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  loginWithDiscord: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isDemoMode: false,
  login: async () => {},
  register: async () => {},
  loginWithDiscord: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("shreecloud-user");
    return saved ? JSON.parse(saved) : null;
  });

  const isDemoMode = user?.isDiscord === true;

  const login = useCallback(async (email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    const u = { id: "1", email, username: email.split("@")[0] };
    setUser(u);
    localStorage.setItem("shreecloud-user", JSON.stringify(u));
  }, []);

  const register = useCallback(async (username: string, email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    const u = { id: "1", email, username };
    setUser(u);
    localStorage.setItem("shreecloud-user", JSON.stringify(u));
  }, []);

  const loginWithDiscord = useCallback(async () => {
    // This is called after the modal confirms — just set user
    await new Promise((r) => setTimeout(r, 600));
    const u = { id: "discord-1", email: "player@discord.gg", username: "DiscordPlayer", isDiscord: true };
    setUser(u);
    localStorage.setItem("shreecloud-user", JSON.stringify(u));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("shreecloud-user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isDemoMode, login, register, loginWithDiscord, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
