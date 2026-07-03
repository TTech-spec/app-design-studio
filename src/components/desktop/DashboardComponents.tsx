import React from "react";

interface HeroCardProps {
  month?: string;
  value: string;
  subtitle: string;
  trend: string;
  trendPercentage: number;
  chartData?: number[];
}

export function HeroCard({
  month = "This Month",
  value,
  subtitle,
  trend,
  trendPercentage,
  chartData = [30, 45, 35, 60, 50, 85, 75, 100, 90, 110],
}: HeroCardProps) {
  return (
    <section className="col-span-12">
      <div className="relative overflow-hidden bg-primary-container rounded-lg p-8 text-white min-h-[320px] flex flex-col justify-between shadow-lg">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDoIzBevISvwbmGlbYoqUukyBGE6Kg6GbFTH1rmO3XdmZHCAOjpQf-z-beeZlUjKp2SDHT__xE_1bs4uD9Fm9FuAQDao4pKsDSALElI1oJca7PMIZx74C8RJEXvQv4VTLRAYYNH0CHdt9Ss7mwztsMwQMsfNM-WR2VKX7qoTCdG7tA81h-qRh3c5fJUpGinT5MBoWZoNi4eYcasjPyVKNfWN_-MGO2QNKlAAZDVNw7nNMOysKi6U0l7')",
            }}
          />
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-label-md font-medium uppercase tracking-wider opacity-80 mb-2">
                {month}
              </p>
              <h2 className="text-[56px] font-bold leading-none mb-1">{value}</h2>
              <p className="text-body-md opacity-90">{subtitle}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">trending_up</span>
              <span className="font-bold">{trend}</span>
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="relative z-10 w-full h-32 mt-8">
          <div className="flex items-end justify-between w-full h-full gap-2 px-2">
            {chartData.map((height, index) => (
              <div
                key={index}
                className="flex-1 bg-white/20 rounded-t-lg transition-all hover:bg-white/40"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface MetricCardProps {
  icon: string;
  value: string;
  label: string;
}

export function MetricCard({ icon, value, label }: MetricCardProps) {
  return (
    <div className="bg-surface rounded-lg p-6 border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-primary mb-4">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <h3 className="text-headline-md font-bold text-on-surface">{value}</h3>
      <p className="text-body-md text-on-surface-variant">{label}</p>
    </div>
  );
}

interface QuickActionButtonProps {
  icon: string;
  title: string;
  description: string;
  onClick?: () => void;
}

export function QuickActionButton({
  icon,
  title,
  description,
  onClick,
}: QuickActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-6 bg-surface border border-outline-variant rounded-lg p-8 transition-all hover:border-primary hover:bg-primary/5 active:scale-[0.99] text-left w-full"
    >
      <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center text-primary group-hover:scale-110 transition-transform flex-shrink-0">
        <span className="material-symbols-outlined text-[32px]">{icon}</span>
      </div>
      <div>
        <h4 className="text-headline-sm mb-1 text-on-surface">{title}</h4>
        <p className="text-body-md text-on-surface-variant">{description}</p>
      </div>
    </button>
  );
}

interface DashboardHeaderProps {
  title: string;
  date?: string;
  showSearch?: boolean;
}

export function DashboardHeader({
  title,
  date,
  showSearch = true,
}: DashboardHeaderProps) {
  return (
    <header className="hidden lg:flex items-center justify-between mb-10">
      <h1 className="text-headline-lg font-headline-lg text-on-background">{title}</h1>
      <div className="flex items-center gap-4">
        {date && <span className="text-body-md text-on-surface-variant">{date}</span>}
        {showSearch && (
          <button className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-variant transition-colors">
            <span className="material-symbols-outlined">search</span>
          </button>
        )}
      </div>
    </header>
  );
}
