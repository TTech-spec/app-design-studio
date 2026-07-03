import { Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Home, ShoppingBag, MessageSquare, User, Settings, Bell, Search, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import type { ReactNode } from "react";

interface DesktopShellProps {
  children: ReactNode;
  title?: string;
  activeNav?: "home" | "marketplace" | "messages" | "profile" | "settings";
}

export function DesktopShell({ children, title = "Agricon NG", activeNav }: DesktopShellProps) {
  const navigate = useNavigate();
  const { profile, signOut, getNotifications, markNotificationAsRead } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const data = await getNotifications();
        setNotifications(data);
        setUnreadCount(data.filter((n: any) => !n.read).length);
      } catch (err) {
        console.error("Failed to load notifications:", err);
      }
    }
    loadNotifications();
  }, [getNotifications]);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/signin" });
  };

  const handleNotificationClick = async () => {
    navigate({ to: "/notifications" });
  };

  const navItems = [
    { id: "home" as const, label: "Home", icon: Home, to: "/home" },
    { id: "marketplace" as const, label: "Marketplace", icon: ShoppingBag, to: "/marketplace" },
    { id: "messages" as const, label: "Messages", icon: MessageSquare, to: "/messages" },
    { id: "profile" as const, label: "Profile", icon: User, to: "/settings" },
    { id: "settings" as const, label: "Settings", icon: Settings, to: "/settings" },
  ];

  return (
    <div className="flex h-screen bg-[#f9faf2] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col border-r border-[#c2c9bb] bg-[#f3f4ed] z-50">
        {/* Logo Section */}
        <div className="px-4 py-6 mb-4 flex items-center gap-3">
          <img src="/agricon_logo.png" alt="Agricon logo" className="h-10 w-auto" />
          <div>
            <h2 className="font-bold text-sm text-[#154212]">Agricon</h2>
            <p className="text-xs text-[#44483d]">Management Portal</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                activeNav === item.id
                  ? "bg-[#d6e4c8] text-[#154212]"
                  : "text-[#44483d] hover:bg-[#e7e9e1]"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="px-2 pb-4 border-t border-[#c2c9bb]/50 pt-4">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
              {profile?.first_name?.[0] || profile?.email?.[0] || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#191c18] truncate">
                {profile?.first_name || profile?.email?.split("@")[0]}
              </p>
              <p className="text-xs text-[#44483d] capitalize">
                {profile?.user_type || "User"}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-2 text-sm text-[#44483d] hover:bg-[#e7e9e1] rounded-lg w-full transition-all"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex justify-between items-center px-6 w-full border-b border-[#c2c9bb] bg-white h-16 shrink-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="font-bold text-lg text-[#154212] whitespace-nowrap">{title}</h1>
            <div className="hidden lg:flex items-center bg-[#f3f4ed] rounded-full px-4 py-1.5 w-full max-w-md ml-8 border border-[#c2c9bb]">
              <Search className="w-4 h-4 text-[#44483d]" />
              <input
                className="bg-transparent border-none focus:ring-0 text-sm w-full px-2 placeholder:text-[#44483d]"
                placeholder="Search across all listings..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleNotificationClick}
              className="text-[#154212] hover:bg-[#e7e9e1] transition-colors duration-200 p-2 rounded-full relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
            <button className="text-[#154212] hover:bg-[#e7e9e1] transition-colors duration-200 p-2 rounded-full">
              <Settings className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#d6e4c8]">
              {profile?.avatar_url ? (
                <img
                  className="w-full h-full object-cover"
                  alt="Profile"
                  src={profile.avatar_url}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#154212] font-bold text-sm">
                  {profile?.first_name?.[0] || "U"}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
