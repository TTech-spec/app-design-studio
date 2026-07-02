import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Sprout, LogOut } from "lucide-react";
import { MobileShell } from "@/components/mobile/MobileShell";
import { EmptyState } from "@/components/mobile/ui";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/home")({
  head: () => ({ meta: [{ title: "Agricon NG — Home" }] }),
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    navigate({ to: "/signin" });
  }

  return (
    <MobileShell
      standalone
      showBack={false}
      showBottomNav={false}
      title="Agricon"
      headerRight={
        <button
          type="button"
          onClick={handleSignOut}
          aria-label="Sign out"
          className="grid h-10 w-10 place-items-center rounded-full hover:bg-muted"
        >
          <LogOut className="h-5 w-5 text-muted-foreground" />
        </button>
      }
    >
      <EmptyState
        icon={<Sprout className="h-8 w-8" />}
        title="Marketplace coming soon"
        body="You're verified and ready to go — the marketplace, listings, and messaging are launching in the next phase of Agricon."
      />
    </MobileShell>
  );
}
