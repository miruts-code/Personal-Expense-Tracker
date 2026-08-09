import { useTransactions } from "../../contexts/TransactionContext";
import "./Dashboard.css";

function Dashboard() {
  const { transactions, totals, categoryTotals } = useTransactions();

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const highestCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  const maxCategoryValue = Math.max(...Object.values(categoryTotals), 1);

  if (transactions.length === 0) {
    return (
      <div className="dashboard empty-state">
        <h2>No transactions yet</h2>
        <p>Add your first transaction to see your spending summary here.</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="summary-cards">
        <div className="summary-card balance">
          <span className="card-label">Balance</span>
          <span className="card-value">${totals.balance.toFixed(2)}</span>
        </div>
        <div className="summary-card income">
          <span className="card-label">Income</span>
          <span className="card-value">${totals.income.toFixed(2)}</span>
        </div>
        <div className="summary-card expenses">
          <span className="card-label">Expenses</span>
          <span className="card-value">${totals.expenses.toFixed(2)}</span>
        </div>
      </div>

      {highestCategory && (
        <p className="insight-line">
          Your highest spending category is <strong>{highestCategory[0]}</strong> at ${highestCategory[1].toFixed(2)}.
        </p>
      )}

      <div className="dashboard-columns">
        <div className="category-breakdown">
          <h3>Spending by Category</h3>
          {Object.entries(categoryTotals).map(([cat, amount]) => (
            <div className="category-bar-row" key={cat}>
              <span className="category-name">{cat}</span>
              <div className="category-bar-track">
                <div
                  className="category-bar-fill"
                  style={{ width: `${(amount / maxCategoryValue) * 100}%` }}
                />
              </div>
              <span className="category-amount">${amount.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="recent-activity">
          <h3>Recent Activity</h3>
          {recentTransactions.map((t) => (
            <div className="recent-item" key={t.id}>
              <div>
                <span className="recent-desc">{t.description || t.category}</span>
                <span className="recent-date">{t.date}</span>
              </div>
              <span className={`recent-amount ${t.type}`}>
                {t.type === "income" ? "+" : "-"}${t.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;