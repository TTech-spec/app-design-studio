import React from "react";

interface FarmerDashboardShellProps {
  children: React.ReactNode;
  userName?: string;
  userAvatar?: string;
  isVerified?: boolean;
  userType?: string;
  onLogout?: () => void;
}

export function FarmerDashboardShell({
  children,
  userName = "Adekunle",
  userAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuASGQiR_ogO9NmWaMI0AMAnwZWyUaOBwmsiC0exy96o9ubZYJUy2w2ipb-3l3Da-_pqk3q-_kY7rxK4U9dlEHK_Z6O7btHM1atG5oVf0Rqi-MFQQT18_tgSRF0OaoMW1OF-aXiQyWPx-U1tEXfhuBdm-UvRa4ttfYkFXYNavYJwvvFx0BIqlYZFYJq830c8j0ngNsV0LIFpHTTUZR2KM7AAnn4TQLoQEZfX_OhbP6fI48adQGFUKpFQ",
  isVerified = true,
  userType = "Premium Vendor",
  onLogout,
}: FarmerDashboardShellProps) {
  return (
    <div className="flex min-h-screen bg-background text-on-background">
      {/* Desktop SideNavBar */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 z-50 w-64 bg-surface dark:bg-inverse-surface border-r border-outline-variant">
        {/* Header */}
        <div className="p-6 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white">
              <span className="material-symbols-outlined">eco</span>
            </div>
            <div>
              <h2 className="text-headline-sm font-headline-sm font-bold text-primary dark:text-inverse-primary leading-tight">
                Agro-Farm
              </h2>
              <p className="text-label-md font-label-md text-on-surface-variant">Management Portal</p>
            </div>
          </div>
        </div>

        {/* User Profile with Verified Badge */}
        <div className="px-6 py-4 mb-4">
          <div className="flex items-center gap-3 bg-surface-container rounded-lg p-3">
            <img
              className="w-10 h-10 rounded-full object-cover"
              alt={userName}
              src={userAvatar}
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-body-md font-bold text-on-surface">{userName}</span>
                {isVerified && (
                  <span
                    className="material-symbols-outlined text-[16px] text-primary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                )}
              </div>
              <span className="text-label-md text-on-surface-variant">{userType}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 px-4 space-y-1">
          {/* Active Tab: Dashboard */}
          <a
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary dark:text-inverse-primary font-bold border-r-4 border-primary bg-secondary-container/30 transition-all"
            href="#"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-body-md font-body-md">Dashboard</span>
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
            href="#"
          >
            <span className="material-symbols-outlined">local_shipping</span>
            <span className="text-body-md font-body-md">Active Shipments</span>
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
            href="#"
          >
            <span className="material-symbols-outlined">receipt_long</span>
            <span className="text-body-md font-body-md">Orders</span>
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
            href="#"
          >
            <span className="material-symbols-outlined">inventory_2</span>
            <span className="text-body-md font-body-md">Inventory</span>
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
            href="#"
          >
            <span className="material-symbols-outlined">chat</span>
            <span className="text-body-md font-body-md">Messages</span>
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
            href="#"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="text-body-md font-body-md">Notifications</span>
          </a>
        </nav>

        {/* Footer Links */}
        <div className="mt-auto px-4 pb-6 space-y-2">
          <button className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg font-bold hover:opacity-90 transition-all active:scale-95 mb-6">
            <span className="material-symbols-outlined">add</span>
            New Request
          </button>
          <a
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary transition-colors"
            href="#"
          >
            <span className="material-symbols-outlined">help</span>
            <span className="text-body-md font-body-md">Support</span>
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-error transition-colors"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onLogout?.();
            }}
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="text-body-md font-body-md">Logout</span>
          </a>
        </div>
      </aside>

      {/* Mobile TopAppBar */}
      <header className="flex lg:hidden justify-between items-center w-full px-4 h-16 bg-surface border-b border-outline-variant fixed top-0 z-50">
        <h1 className="text-headline-sm font-bold text-primary">Dashboard</h1>
        <div className="flex items-center gap-4">
          <button className="relative">
            <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
          </button>
          <img
            className="w-8 h-8 rounded-full"
            alt={userName}
            src={userAvatar}
          />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="lg:ml-64 pt-20 lg:pt-0 min-h-screen px-4 md:px-margin-desktop py-8 w-full">
        {children}
      </main>

      {/* Mobile BottomNavBar */}
      <nav className="fixed lg:hidden bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 bg-surface border-t border-outline-variant rounded-t-xl shadow-lg">
        <a className="flex flex-col items-center justify-center text-primary" href="#">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            home
          </span>
          <span className="text-label-md font-label-md">Home</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant" href="#">
          <span className="material-symbols-outlined">receipt_long</span>
          <span className="text-label-md font-label-md">Orders</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant" href="#">
          <span className="material-symbols-outlined">inventory_2</span>
          <span className="text-label-md font-label-md">Inventory</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant" href="#">
          <span className="material-symbols-outlined">person</span>
          <span className="text-label-md font-label-md">Me</span>
        </a>
      </nav>
    </div>
  );
}
