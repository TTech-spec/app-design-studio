import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  User, ShieldCheck, Lock, Bell, Globe, HelpCircle, Headphones,
  Info, LogOut, ChevronRight, Moon, Sun, Smartphone, Camera, ChevronDown,
} from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { DesktopShell } from "@/components/desktop";
import { VerificationBadge } from "@/components/mobile/ui";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth, authErrorMessage } from "@/lib/auth-context";
import { toast } from "sonner";
import { LANGUAGES } from "@/lib/agricon-data";
import { useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Agricon NG — Settings" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { profile, signOut } = useAuth();
  const { locale, setLocale } = useLocale();
  const [darkMode, setDarkMode] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [notifPush, setNotifPush] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSms, setNotifSms] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "Adekunle Kolawole";
  const email = profile?.email ?? "adekunle@kolawolefarms.ng";
  const initials = fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const currentLang = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut();
      toast.success("Signed out successfully.");
      navigate({ to: "/signin" });
    } catch (err) {
      toast.error(authErrorMessage(err));
    } finally {
      setSigningOut(false);
    }
  }

  const groups = [
    {
      title: "Account",
      items: [
        {
          icon: <User className="h-5 w-5" />,
          label: "Personal information",
          onPress: () => navigate({ to: "/personal-info" }),
        },
        {
          icon: <ShieldCheck className="h-5 w-5" />,
          label: "Verification status",
          value: "Verified",
          onPress: () => navigate({ to: "/verification-status" }),
        },
        {
          icon: <Lock className="h-5 w-5" />,
          label: "Privacy & security",
          onPress: () => navigate({ to: "/settings" }),
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          icon: <Globe className="h-5 w-5" />,
          label: "Language",
          value: `${currentLang.flag} ${currentLang.name}`,
          onPress: () => setShowLanguageDropdown(!showLanguageDropdown),
          showDropdown: showLanguageDropdown,
          dropdownContent: (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border-2 border-[#c2c9bb] rounded-2xl shadow-lg z-50 overflow-hidden">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => {
                    setLocale(l.code);
                    setShowLanguageDropdown(false);
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-3 text-left transition ${locale === l.code ? "bg-[#d6e4c8] text-[#154212]" : "hover:bg-[#f3f4ed] text-[#191c18]"}`}
                >
                  <span className="text-lg">{l.flag}</span>
                  <span className="text-sm font-medium">{l.name}</span>
                </button>
              ))}
            </div>
          ),
        },
        {
          icon: darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />,
          label: "Appearance",
          value: darkMode ? "Dark" : "Light",
          toggle: true,
          toggleValue: darkMode,
          onToggle: () => setDarkMode((d) => !d),
        },
      ],
    },
    {
      title: "Notifications",
      items: [
        {
          icon: <Smartphone className="h-5 w-5" />,
          label: "Push notifications",
          toggle: true,
          toggleValue: notifPush,
          onToggle: () => setNotifPush((v) => !v),
        },
        {
          icon: <Bell className="h-5 w-5" />,
          label: "Email notifications",
          toggle: true,
          toggleValue: notifEmail,
          onToggle: () => setNotifEmail((v) => !v),
        },
        {
          icon: <Bell className="h-5 w-5" />,
          label: "SMS alerts",
          toggle: true,
          toggleValue: notifSms,
          onToggle: () => setNotifSms((v) => !v),
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: <HelpCircle className="h-5 w-5" />,
          label: "Help center",
          onPress: () => navigate({ to: "/help-center" }),
        },
        {
          icon: <Headphones className="h-5 w-5" />,
          label: "Contact support",
          onPress: () => navigate({ to: "/contact-support" }),
        },
        {
          icon: <Info className="h-5 w-5" />,
          label: "About Agricon",
          value: "v1.0.4",
          onPress: () => {},
        },
      ],
    },
  ] as const;

  if (isMobile) {
    return (
      <MobileShell
        standalone
        title="Settings"
        showBack={false}
        showBottomNav
      >
        {/* Profile card */}
        <button
          type="button"
          onClick={() => navigate({ to: "/farmer-profile" })}
          className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:bg-secondary transition text-left"
        >
          <div className="relative">
            <div className="grid h-14 w-14 place-items-center rounded-full gradient-primary text-white text-xl font-black">
              {initials}
            </div>
            <button
              type="button"
              className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-card border border-border shadow"
              onClick={(e) => {
                e.stopPropagation();
                navigate({ to: "/profile-photo" });
              }}
              aria-label="Change photo"
            >
              <Camera className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="font-bold text-foreground truncate">{fullName}</p>
              <VerificationBadge />
            </div>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
            <p className="mt-0.5 text-xs text-primary font-semibold">View profile →</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        </button>

        {/* Settings groups */}
        {groups.map((g) => (
          <div key={g.title} className="mt-5">
            <h3 className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              {g.title}
            </h3>
            <div className="overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
              {g.items.map((item, i) => {
                const isToggle = "toggle" in item && item.toggle;
                const hasDropdown = "showDropdown" in item && item.showDropdown;
                return (
                  <div key={item.label} className="relative">
                    <div
                      className="flex items-center gap-3 p-4"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                        {item.icon}
                      </span>
                      <span className="flex-1 text-sm font-semibold text-foreground">
                        {item.label}
                      </span>
                      {isToggle ? (
                        <button
                          type="button"
                          role="switch"
                          aria-checked={"toggleValue" in item ? item.toggleValue : false}
                          onClick={"onToggle" in item ? item.onToggle : undefined}
                          className={`relative h-6 w-11 rounded-full transition-colors ${
                            "toggleValue" in item && item.toggleValue ? "bg-primary" : "bg-border"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                              "toggleValue" in item && item.toggleValue ? "right-0.5" : "left-0.5"
                            }`}
                          />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={"onPress" in item ? item.onPress : undefined}
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                        >
                          {"value" in item && item.value && (
                            <span>{item.value}</span>
                          )}
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    {hasDropdown && "dropdownContent" in item && item.dropdownContent}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Sign out */}
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-destructive/30 bg-destructive/5 p-4 text-sm font-bold text-destructive hover:bg-destructive/10 disabled:opacity-50 transition"
        >
          <LogOut className="h-5 w-5" />
          {signingOut ? "Signing out…" : "Sign out"}
        </button>

        <p className="mt-4 text-center text-[11px] text-muted-foreground">
          Agricon NG · v1.0.4 · Made in Nigeria 🇳🇬
        </p>
      </MobileShell>
    );
  }

  // Desktop view
  return (
    <DesktopShell title="Settings" activeNav="settings">
      <div className="max-w-4xl mx-auto p-6">
        {/* Profile Section */}
        <section className="mb-8">
          <div className="bg-white border border-[#c2c9bb] rounded-2xl p-6 flex items-center gap-6 hover:bg-[#f3f4ed] transition-colors">
            <div className="w-20 h-20 rounded-full bg-[#154212] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-bold text-[#191c18]">{fullName}</h3>
                <VerificationBadge />
              </div>
              <p className="text-sm text-[#44483d]">{email}</p>
            </div>
            <button
              onClick={() => navigate({ to: "/farmer-profile" })}
              className="px-4 py-2 bg-[#154212] text-white rounded-lg hover:bg-[#1a5a17] transition"
            >
              View Profile
            </button>
          </div>
        </section>

        {/* Settings groups */}
        {groups.map((g) => (
          <div key={g.title} className="mb-6">
            <h3 className="mb-3 px-2 text-sm font-bold uppercase tracking-wider text-[#44483d]">
              {g.title}
            </h3>
            <div className="bg-white border border-[#c2c9bb] rounded-2xl overflow-hidden divide-y divide-[#c2c9bb]/30">
              {g.items.map((item, i) => {
                const isToggle = "toggle" in item && item.toggle;
                const hasDropdown = "showDropdown" in item && item.showDropdown;
                return (
                  <div key={item.label} className="relative">
                    <div
                      className="flex items-center gap-4 p-4 hover:bg-[#f3f4ed] transition"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#d6e4c8] text-[#154212]">
                        {item.icon}
                      </span>
                      <span className="flex-1 text-sm font-semibold text-[#191c18]">
                        {item.label}
                      </span>
                      {isToggle ? (
                        <button
                          type="button"
                          role="switch"
                          aria-checked={"toggleValue" in item ? item.toggleValue : false}
                          onClick={"onToggle" in item ? item.onToggle : undefined}
                          className={`relative h-6 w-11 rounded-full transition-colors ${
                            "toggleValue" in item && item.toggleValue ? "bg-[#154212]" : "bg-[#c2c9bb]"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                              "toggleValue" in item && item.toggleValue ? "right-0.5" : "left-0.5"
                            }`}
                          />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={"onPress" in item ? item.onPress : undefined}
                          className="flex items-center gap-2 text-sm text-[#44483d] hover:text-[#191c18]"
                        >
                          {"value" in item && item.value && (
                            <span>{item.value}</span>
                          )}
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    {hasDropdown && "dropdownContent" in item && item.dropdownContent}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Sign out */}
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600 hover:bg-red-100 disabled:opacity-50 transition"
        >
          <LogOut className="h-5 w-5" />
          {signingOut ? "Signing out…" : "Sign out"}
        </button>

        <p className="mt-4 text-center text-xs text-[#44483d]">
          Agricon NG · v1.0.4 · Made in Nigeria 🇳🇬
        </p>
      </div>
    </DesktopShell>
  );
}
