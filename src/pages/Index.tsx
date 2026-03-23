import { useState } from "react";
import { useParams } from "react-router-dom";
import { PanelSidebar } from "@/components/PanelSidebar";
import { PanelTopBar } from "@/components/PanelTopBar";
import { ConsolePage } from "@/components/pages/ConsolePage";
import { PluginInstallerPage } from "@/components/pages/PluginInstallerPage";
import { PluginsManagerPage } from "@/components/pages/PluginsManagerPage";
import { AccountPage } from "@/components/pages/AccountPage";
import { PlayersPage } from "@/components/pages/PlayersPage";
import { VersionPage } from "@/components/pages/VersionPage";
import { PlaceholderPage } from "@/components/pages/PlaceholderPage";
import { FilesPage } from "@/components/pages/FilesPage";
import { SettingsPage } from "@/components/pages/SettingsPage";
import { StartupPage } from "@/components/pages/StartupPage";
import { ServerPropertiesPage } from "@/components/pages/ServerPropertiesPage";
import { WorldsPage } from "@/components/pages/WorldsPage";
import { ActivityPage } from "@/components/pages/ActivityPage";
import { SubusersPage } from "@/components/pages/SubusersPage";
import { TemplatesPage } from "@/components/pages/TemplatesPage";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [activePage, setActivePage] = useState("Console");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { serverId } = useParams();
  const isMobile = useIsMobile();

  const handleNavigate = (page: string) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  const renderPage = () => {
    if (activePage === "Console") return <ConsolePage />;
    if (activePage === "Plugin Installer") return <PluginInstallerPage onManagePlugins={() => handleNavigate("Plugins Manager")} />;
    if (activePage === "Plugins Manager") return (
      <PluginsManagerPage onViewFiles={(folderName) => { handleNavigate("Files"); }} />
    );
    if (activePage === "Account") return <AccountPage />;
    if (activePage === "Players") return <PlayersPage />;
    if (activePage === "Version") return <VersionPage />;
    if (activePage === "Files") return <FilesPage onOpenPluginsManager={() => handleNavigate("Plugins Manager")} />;
    if (activePage === "Settings") return <SettingsPage />;
    if (activePage === "Startup") return <StartupPage />;
    if (activePage === "Server Properties") return <ServerPropertiesPage />;
    if (activePage === "Worlds") return <WorldsPage />;
    if (activePage === "Activity") return <ActivityPage />;
    if (activePage === "Subusers") return <SubusersPage />;
    return <PlaceholderPage title={activePage} />;
  };

  return (
    <div className="flex min-h-screen bg-background">
      {!isMobile && (
        <PanelSidebar activePage={activePage} onNavigate={handleNavigate} />
      )}

      {isMobile && mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-50 w-[250px] max-w-[80vw] animate-in slide-in-from-left duration-200">
            <PanelSidebar activePage={activePage} onNavigate={handleNavigate} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <PanelTopBar
          activePage={activePage}
          onMenuToggle={isMobile ? () => setMobileMenuOpen(!mobileMenuOpen) : undefined}
        />
        <main className="flex-1 p-3 sm:p-5 md:p-6 overflow-auto page-enter" key={activePage}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default Index;
