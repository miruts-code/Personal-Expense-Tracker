import { Pencil, Trash2 } from "lucide-react";
import "./TransactionList.css";

function TransactionList({ transactions, onEdit, onDelete, emptyMessage }) {
  if (!transactions || transactions.length === 0) {
    return <p className="transaction-list-empty">{emptyMessage || "No transactions found."}</p>;
  }

  return (
    <div className="transaction-list">
      {transactions.map((t) => (
        <div className="transaction-row" key={t.id}>
          <div className="transaction-main">
            <span className="transaction-desc">{t.description || t.category}</span>
            <span className="transaction-meta">
              {t.category} · {t.date}
            </span>
          </div>
          <span className={`transaction-amount ${t.type}`}>
            {t.type === "income" ? "+" : "-"}${t.amount.toFixed(2)}
          </span>
          <div className="transaction-actions">
            <button
              className="icon-btn edit"
              onClick={() => onEdit(t.id)}
              aria-label="Edit transaction"
              title="Edit"
            >
              <Pencil size={16} />
            </button>
            <button
              className="icon-btn delete"
              onClick={() => onDelete(t.id)}
              aria-label="Delete transaction"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TransactionList;
