import { Link, NavLink, useLocation } from "react-router";
import { Sparkles } from "lucide-react";
import { Button } from "./ui/button";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/video-creator", label: "Video maker" },
];

export function Appbar() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-sm font-semibold tracking-[0.2em] text-white/90 uppercase">
          <span className="flex size-8 items-center justify-center rounded-full bg-lime-300/20 text-lime-300">
            <Sparkles className="size-4" />
          </span>
          Higgsy
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.to;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? "bg-white text-neutral-950" : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild className="hidden text-white hover:bg-white/5 sm:inline-flex">
            <Link to="/signin">Sign in</Link>
          </Button>
          <Button asChild className="rounded-full bg-lime-300 text-neutral-950 hover:bg-lime-200">
            <Link to="/signup">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}