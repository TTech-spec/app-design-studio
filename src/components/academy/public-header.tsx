import { Link, useNavigate } from "@tanstack/react-router";
import { Infinity as InfinityIcon, Search } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useAcademy } from "@/lib/academy/store";
import { btn, Logo } from "./ui";

/** Coursera-style top bar for public pages (catalogue, Plus trial). */
export function PublicHeader({
  initialQuery = "",
  onSearch,
}: {
  initialQuery?: string;
  onSearch?: (q: string) => void;
}) {
  const { user } = useAcademy();
  const navigate = useNavigate();
  const [q, setQ] = useState(initialQuery);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(q.trim());
    else navigate({ to: "/catalog", search: { q: q.trim() } });
  };
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-white">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-3 px-4 md:h-[72px] md:gap-5 md:px-8">
        <Link to="/" aria-label="DarlTech Academy home">
          <Logo />
        </Link>
        <Link
          to="/catalog"
          search={{ q: "" }}
          className="hidden h-11 items-center rounded-lg bg-primary px-4 text-sm font-bold text-white lg:inline-flex"
        >
          Explore
        </Link>
        <form onSubmit={submit} role="search" className="hidden max-w-[560px] flex-1 md:flex">
          <label className="flex h-[46px] w-full items-center gap-2.5 rounded-full border border-[#b9c3d8] pl-4 pr-1.5 focus-within:border-primary">
            <span className="sr-only">Search the catalogue</span>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="What do you want to learn?"
              className="w-full bg-transparent text-[15px] text-primary outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              aria-label="Search"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D7372C] text-white"
            >
              <Search size={18} />
            </button>
          </label>
        </form>
        <div className="flex-1" />
        <Link
          to="/plus/trial"
          search={{}}
          className="hidden items-center gap-1.5 text-[15px] font-extrabold text-[#D7372C] hover:underline sm:inline-flex"
        >
          <InfinityIcon size={18} strokeWidth={2.4} /> DarlTech Plus
        </Link>
        {user ? (
          <Link
            to={user.role === "tutor" ? "/tutor" : "/student"}
            className={btn.outline + " h-11"}
          >
            My dashboard
          </Link>
        ) : (
          <>
            <Link
              to="/login"
              className="hidden text-[15px] font-bold text-primary hover:underline sm:block"
            >
              Log in
            </Link>
            <Link to="/join" className={btn.outline + " h-11 whitespace-nowrap px-4"}>
              Join for free
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
