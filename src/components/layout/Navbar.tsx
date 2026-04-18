import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export default function Navbar({ isDark, toggleTheme }: NavbarProps) {
  const location = useLocation();

  const links = [
    { path: "/", label: "Home" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/documents", label: "Documents" },
    { path: "/chat", label: "Chat" },
    { path: "/how-it-works", label: "How it works" },
    { path: "/settings", label: "Settings" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center group-hover:bg-violet-700 transition-colors">
            <span className="text-white text-xs font-bold">SB</span>
          </div>
          <span className="font-semibold text-gray-900 dark:text-white hidden sm:block">
            Second Brain
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1 overflow-x-auto">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="relative flex-shrink-0"
            >
              {location.pathname === link.path && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-lg"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className={`relative z-10 px-3 py-1.5 text-sm rounded-lg block transition-colors whitespace-nowrap ${
                  location.pathname === link.path
                    ? "text-gray-900 dark:text-white font-medium"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {link.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="w-8 h-8 rounded-lg flex-shrink-0"
        >
          {isDark ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </Button>
      </div>
    </header>
  );
}
