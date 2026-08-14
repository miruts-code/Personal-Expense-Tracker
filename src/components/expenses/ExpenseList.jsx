import { Pencil, Trash2 } from "lucide-react";
import "./ExpenseList.css";

function ExpenseList({ expenses, onEdit, onDelete, emptyMessage }) {
  if (!expenses || expenses.length === 0) {
    return <p className="expense-list-empty">{emptyMessage || "No expenses found."}</p>;
  }

  return (
    <div className="expense-list">
      {expenses.map((expense) => (
        <div className="expense-row" key={expense.id}>
          <div className="expense-main">
            <span className="expense-desc">{expense.description || expense.category}</span>
            <span className="expense-meta">
              {expense.category} · {expense.date}
            </span>
          </div>
          <span className={`expense-amount ${expense.type}`}>
            -${expense.amount.toFixed(2)}
          </span>
          <div className="expense-actions">
            <button
              className="icon-btn edit"
              onClick={() => onEdit(expense.id)}
              aria-label="Edit expense"
              title="Edit"
            >
              <Pencil size={16} />
            </button>
            <button
              className="icon-btn delete"
              onClick={() => onDelete(expense.id)}
              aria-label="Delete expense"
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

export default ExpenseList;
