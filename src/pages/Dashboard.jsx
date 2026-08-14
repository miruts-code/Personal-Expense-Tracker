import { Link } from "react-router-dom";
import { Receipt, History, PiggyBank, ArrowRight } from "lucide-react";
import { useExpenses } from "../contexts/ExpenseContext";
import { useAuth } from "../contexts/AuthContext";
import "./Dashboard.css";

const QUICK_LINKS = [
  { to: "/expenses", icon: Receipt, title: "Expenses", text: "Add, edit, or delete an expense." },
  { to: "/history", icon: History, title: "History", text: "Filter and review past activity." },
  { to: "/budgets", icon: PiggyBank, title: "Budgets", text: "Check spending against your limits." },
];

function Dashboard() {
  const { currentUser } = useAuth();
  const { totals, expenses, budgets, currentMonthCategoryTotals } = useExpenses();
  const hasData = expenses.length > 0;

  return (
    <div className="dashboard-page">
      <header className="dashboard-hero">
        <h1>Welcome{currentUser?.name ? `, ${currentUser.name}` : ""}.</h1>
        <p className="dashboard-subtitle">Here's where things stand right now.</p>
      </header>

      {hasData ? (
        <div className="dashboard-snapshot">
          <div className="snapshot-card balance">
            <span className="snapshot-label">Balance</span>
            <span className="snapshot-value">${totals.balance.toFixed(2)}</span>
          </div>
          <div className="snapshot-card budget">
            <span className="snapshot-label">Budget</span>
            <span className="snapshot-value">${totals.budget.toFixed(2)}</span>
          </div>
          <div className="snapshot-card expenses">
            <span className="snapshot-label">Expenses</span>
            <span className="snapshot-value">${totals.expenses.toFixed(2)}</span>
          </div>
        </div>
      ) : (
        <p className="dashboard-empty">
          No expenses yet — add your first one to see your balance here.
        </p>
      )}

      <div className="quick-links-grid">
        {QUICK_LINKS.map(({ to, icon: Icon, title, text }) => (
          <Link to={to} className="quick-link-card" key={to}>
            <Icon size={22} className="quick-link-icon" />
            <h3>{title}</h3>
            <p>{text}</p>
            <span className="quick-link-arrow">
              Go there <ArrowRight size={14} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;