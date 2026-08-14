import { NavLink } from "react-router-dom";
import {
  Menu,
  Home,
  ArrowLeftRight,
  History,
  PiggyBank,
  LogOut,
  Wallet,
} from "lucide-react";
import "./Sidebar.css";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/history", label: "History", icon: History },
  { to: "/budgets", label: "Budgets", icon: PiggyBank },
];

function Sidebar({ expanded, onToggle, currentUser, onLogout }) {
  return (
    <aside className={`sidebar ${expanded ? "expanded" : "collapsed"}`}>
      <div className="sidebar-header">
        <button
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label={expanded ? "Collapse menu" : "Expand menu"}
          aria-expanded={expanded}
        >
          <Menu size={20} />
        </button>
        <div className="sidebar-brand">
          <Wallet size={20} className="sidebar-brand-icon" />
          {expanded && <span className="sidebar-brand-text">ExpenseTracker</span>}
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            title={!expanded ? label : undefined}
          >
            <Icon size={20} className="sidebar-link-icon" />
            {expanded && <span className="sidebar-link-text">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {expanded && currentUser && (
          <p className="sidebar-user">{currentUser.name || currentUser.email}</p>
        )}
        <button
          className="sidebar-link sidebar-logout"
          onClick={onLogout}
          title={!expanded ? "Log Out" : undefined}
        >
          <LogOut size={20} className="sidebar-link-icon" />
          {expanded && <span className="sidebar-link-text">Log Out</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
