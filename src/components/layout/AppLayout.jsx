import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Sidebar from "./Sidebar";
import "./AppLayout.css";

function AppLayout() {
  const [expanded, setExpanded] = useState(false);
  const { currentUser, logout } = useAuth();

  return (
    <div className="app-layout">
      <Sidebar
        expanded={expanded}
        onToggle={() => setExpanded((prev) => !prev)}
        currentUser={currentUser}
        onLogout={logout}
      />
      <main className={`app-content ${expanded ? "sidebar-expanded" : "sidebar-collapsed"}`}>
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
