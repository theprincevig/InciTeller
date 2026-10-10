import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";

// Reusable page wrapper: sidebar + mobile top bar + content area.
// Whatever you pass as `children` is rendered inside the content area.
export default function AppLayout({ children }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the drawer after navigating
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Escape closes the drawer
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="min-h-screen">
      {/* Phone / tablet top bar */}
      <header className="topbar sticky top-0 z-30 flex items-center justify-between px-4 py-3 lg:hidden">
        <Link to="/" className="brand-gradient-text brand-font pb-1 text-2xl font-bold">
          InciTeller
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="sidebar"
          className="btn-secondary btn-sm"
        >
          <Menu size={18} aria-hidden="true" />
          Menu
        </button>
      </header>

      {open && (
        <div
          className="overlay fixed inset-0 z-40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar open={open} onClose={() => setOpen(false)} />

      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 lg:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}