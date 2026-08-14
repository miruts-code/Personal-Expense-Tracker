import { Wallet } from "lucide-react";
import "./WelcomePage.css";

function WelcomePage({ onSignIn, onSignUp }) {
  return (
    <div className="welcome-page">
      <header className="welcome-topbar">
        <div className="welcome-topbar-brand">
          <Wallet size={20} className="welcome-brand-icon" />
          <span>ExpenseTracker</span>
        </div>
        <nav className="welcome-topbar-links">
          <button className="welcome-link" onClick={onSignIn}>Sign In</button>
          <button className="welcome-link" onClick={onSignUp}>Sign Up</button>
        </nav>
      </header>

      <main className="welcome-page-content">
        <section className="welcome-hero">
          <div className="welcome-brand">
            <Wallet size={28} className="welcome-brand-icon" />
            <span className="welcome-brand-text">ExpenseTracker</span>
          </div>

          <h1 className="welcome-title">Stay on top of every expense.</h1>

          <p className="welcome-description">
            Keep your spending in check, monitor category budgets, and review your history in a simple,
            focused dashboard designed for real-life budgeting.
          </p>
        </section>
      </main>
    </div>
  );
}

export default WelcomePage;
