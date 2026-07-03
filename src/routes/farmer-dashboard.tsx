import { createFileRoute } from "@tanstack/react-router";
import { FarmerDashboardShell } from "@/components/desktop/FarmerDashboardShell";
import {
  DashboardHeader,
  HeroCard,
  MetricCard,
  QuickActionButton,
} from "@/components/desktop/DashboardComponents";

export const Route = createFileRoute("/farmer-dashboard")({
  head: () => ({ meta: [{ title: "Agricon NG — Farmer Dashboard" }] }),
  component: FarmerDashboard,
});

function FarmerDashboard() {
  const handleNewRequest = () => {
    console.log("New request clicked");
  };

  const handleNewListing = () => {
    console.log("New listing clicked");
  };

  const handleMyFarms = () => {
    console.log("My farms clicked");
  };

  return (
    <FarmerDashboardShell>
      <div className="max-w-[1280px] mx-auto">
        {/* Page Header */}
        <DashboardHeader
          title="Dashboard"
          date="Wednesday, 24 May 2024"
          showSearch
        />

        {/* Bento Layout Content */}
        <div className="grid grid-cols-12 gap-gutter pb-16 lg:pb-0">
          {/* Hero Card (Span 12) */}
          <HeroCard
            month="This Month"
            value="₦4.28M"
            subtitle="Total inquiry value"
            trend="+18%"
            trendPercentage={18}
          />

          {/* Metrics Row */}
          <div className="col-span-12 md:col-span-4">
            <MetricCard icon="layers" value="12" label="Listings" />
          </div>
          <div className="col-span-12 md:col-span-4">
            <MetricCard icon="chat_bubble" value="48" label="Inquiries" />
          </div>
          <div className="col-span-12 md:col-span-4">
            <MetricCard icon="visibility" value="1.2k" label="Views" />
          </div>

          {/* Quick Actions Section */}
          <section className="col-span-12 mt-4">
            <h2 className="text-headline-sm font-headline-sm text-on-background mb-6">
              Quick actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              <QuickActionButton
                icon="add_circle"
                title="New listing"
                description="Add new produce or equipment to your catalog"
                onClick={handleNewListing}
              />
              <QuickActionButton
                icon="potted_plant"
                title="My farms"
                description="Monitor your active agricultural properties"
                onClick={handleMyFarms}
              />
            </div>
          </section>
        </div>
      </div>
    </FarmerDashboardShell>
  );
}
