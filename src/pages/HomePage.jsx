import { Link } from "react-router-dom";
import { ArrowLeftRight, History, PiggyBank, ArrowRight } from "lucide-react";
import { useTransactions } from "../contexts/TransactionContext";
import { useAuth } from "../contexts/AuthContext";
import "./HomePage.css";

const FEATURES = [
  {
    to: "/transactions",
    icon: ArrowLeftRight,
    title: "Track transactions",
    text: "Log income and expenses, and edit or delete any entry in seconds.",
  },
  {
    to: "/history",
    icon: History,
    title: "Browse your history",
    text: "Filter past activity by date, category, or type to see where money went.",
  },
  {
    to: "/budgets",
    icon: PiggyBank,
    title: "Set budgets",
    text: "Give each category a monthly limit and watch your progress in real time.",
  },
];

function HomePage() {
  const { currentUser } = useAuth();
  const { totals, transactions } = useTransactions();
  const hasData = transactions.length > 0;

  return (
    <div className="home-page">
      <header className="home-hero">
        <h1>Welcome{currentUser?.name ? `, ${currentUser.name}` : ""}.</h1>
        <p className="home-subtitle">
          This is your personal expense tracker — a simple place to record what you spend and earn,
          understand your habits, and stay inside your budget.
        </p>
      </header>

      {hasData && (
        <div className="home-snapshot">
          <div className="snapshot-card balance">
            <span className="snapshot-label">Balance</span>
            <span className="snapshot-value">${totals.balance.toFixed(2)}</span>
          </div>
          <div className="snapshot-card income">
            <span className="snapshot-label">Income</span>
            <span className="snapshot-value">${totals.income.toFixed(2)}</span>
          </div>
          <div className="snapshot-card expenses">
            <span className="snapshot-label">Expenses</span>
            <span className="snapshot-value">${totals.expenses.toFixed(2)}</span>
          </div>
        </div>
      )}

      <section className="home-about">
        <h2>What this app does</h2>
        <p>
          Every entry you add is stored securely to your account. From here you can add a
          transaction, review your full history, and set spending budgets by category — all
          without needing anything more than an email and password.
        </p>
      </section>

      <section className="home-services">
        <h2>How to get started</h2>
        <div className="feature-grid">
          {FEATURES.map(({ to, icon: Icon, title, text }) => (
            <Link to={to} className="feature-card" key={to}>
              <Icon size={22} className="feature-icon" />
              <h3>{title}</h3>
              <p>{text}</p>
              <span className="feature-link">
                Go there <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
