import { Link } from "react-router-dom";
import { ArrowLeftRight, History, PiggyBank, ArrowRight } from "lucide-react";
import { useExpenses } from "../contexts/ExpenseContext";
import { useAuth } from "../contexts/AuthContext";
import "./Dashboard.css";

const QUICK_LINKS = [
  { to: "/expenses", icon: ArrowLeftRight, title: "Expenses", text: "Add, edit, or delete an expense." },
  { to: "/history", icon: History, title: "History", text: "Filter and review past activity." },
  { to: "/budgets", icon: PiggyBank, title: "Budgets", text: "Check spending against your limits." },
];

function Dashboard() {
  const { currentUser } = useAuth();
  const { totals, expenses, budgets, currentMonthCategoryTotals } = useExpenses();
  const hasData = expenses.length > 0;

  const totalBudget = Object.values(budgets).reduce((sum, value) => sum + Number(value || 0), 0);

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

      {Object.keys(budgets).length > 0 && (
        <div className="dashboard-category-summary">
          <h2>Budget by Category</h2>
          <div className="dashboard-category-list">
            {Object.entries(budgets).map(([category, amount]) => {
              const spent = currentMonthCategoryTotals[category] || 0;
              const available = Number(amount || 0) - spent;

              return (
                <div key={category} className="dashboard-category-item">
                  <div className="dashboard-category-header">
                    <span>{category}</span>
                    <span>${available.toFixed(2)} available</span>
                  </div>
                  <div className="dashboard-category-meta">
                    <span>Budget: ${Number(amount || 0).toFixed(2)}</span>
                    <span>Spent: ${spent.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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
