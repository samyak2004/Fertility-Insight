import { Link, NavLink } from "react-router-dom";

export default function Layout({ children }) {
  const linkClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm transition duration-300 ${
      isActive
        ? "bg-white/10 text-white shadow-float"
        : "text-sky-100/75 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <div className="relative min-h-screen overflow-hidden bg-mesh text-slate-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-24 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl animate-drift" />
        <div className="absolute right-[-4rem] top-52 h-80 w-80 rounded-full bg-teal/10 blur-3xl animate-drift [animation-delay:1.8s]" />
      </div>
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <header className="sticky top-0 z-30 py-5">
          <nav className="glass panel-outline flex items-center justify-between rounded-[1.75rem] px-4 py-3 shadow-panel">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-3 font-display text-lg tracking-wide text-white">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-300/30 via-sky-200/20 to-teal/20 text-base shadow-float">
                  AI
                </span>
                <span className="hidden sm:block">Fertility Insight AI</span>
              </Link>
              <div className="hidden lg:inline-flex metric-pill text-xs">
                Explainable healthcare dashboard
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.25em] text-sky-100/70">
                <span className="h-2.5 w-2.5 animate-pulse-slow rounded-full bg-leaf shadow-[0_0_18px_rgba(52,211,153,0.75)]" />
                Not Diagnostic
              </div>
              <div className="flex items-center gap-2">
                <NavLink to="/" className={linkClass}>
                  Home
                </NavLink>
                <NavLink to="/assessment" className={linkClass}>
                  Assessment
                </NavLink>
              </div>
            </div>
          </nav>
        </header>
        <main className="flex-1 py-6">{children}</main>
      </div>
    </div>
  );
}
