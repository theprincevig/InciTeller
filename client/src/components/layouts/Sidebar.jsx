import { Link, NavLink, useNavigate } from "react-router-dom";
import { BookOpen, House, LogIn, LogOut, PenLine, UserPlus, UserRound, X } from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore.js";
import { Avatar } from "../common";

export default function Sidebar({ open, onClose }) {
  const authUser = useAuthStore((s) => s.authUser);
  const sessionLoading = useAuthStore((s) => s.sessionLoading);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <aside
      id="sidebar"
      aria-label="Main menu"
      className={`sidebar fixed inset-y-0 left-0 z-50 flex w-64 flex-col transition-transform duration-200 lg:visible lg:translate-x-0 ${
        open ? "translate-x-0" : "invisible -translate-x-full"
      }`}
    >
      {/* Brand */}
      <div className="sidebar-brand flex items-start justify-between">
        <Link to="/">
          <span className="brand-gradient-text brand-font block pb-1 text-3xl font-bold leading-tight">
            InciTeller
          </span>
          <span className="block text-sm text-(--text-secondary)">
            Spill the chaos.
          </span>
        </Link>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="btn-secondary btn-sm lg:hidden"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      {/* Links (NavLink sets aria-current="page" on the active one) */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul>
          <li>
            <NavLink to="/" end className="nav-link flex items-center gap-3">
              <House size={18} aria-hidden="true" />
              Home
            </NavLink>
          </li>
          {authUser && (
            <>
              <li>
                <NavLink to="/stories/new" className="nav-link flex items-center gap-3">
                  <PenLine size={18} aria-hidden="true" />
                  Write a story
                </NavLink>
              </li>
              <li>
                <NavLink to="/my-stories" className="nav-link flex items-center gap-3">
                  <BookOpen size={18} aria-hidden="true" />
                  My stories
                </NavLink>
              </li>
              <li>
                <NavLink to="/profile" className="nav-link flex items-center gap-3">
                  <UserRound size={18} aria-hidden="true" />
                  Profile
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Account */}
      <div className="border-t border-(--line) p-4">
        {sessionLoading ? (
          <div className="shimmer h-12" />
        ) : authUser ? (
          <div className="space-y-3">
            <Link to="/profile" className="flex items-center gap-3">
              <Avatar user={authUser} className="h-10 w-10" />
              <span className="truncate font-medium">{authUser.name}</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="btn-secondary w-full"
            >
              <LogOut size={18} aria-hidden="true" />
              Log out
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <Link to="/signup" className="btn-primary">
              <UserPlus size={18} aria-hidden="true" />
              Sign up
            </Link>
            <Link to="/login" className="btn-secondary w-full">
              <LogIn size={18} aria-hidden="true" />
              Log in
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}