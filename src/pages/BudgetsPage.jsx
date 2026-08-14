import { useState } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { useExpenses } from "../contexts/ExpenseContext";
import "./BudgetsPage.css";

function BudgetsPage() {
  const { categories, budgets, setBudget, deleteBudget, currentMonthCategoryTotals } =
    useExpenses();

  const [editingCategory, setEditingCategory] = useState(null);
  const [draftAmount, setDraftAmount] = useState("");

  function startEdit(category) {
    setEditingCategory(category);
    setDraftAmount(budgets[category] ?? "");
  }

  function cancelEdit() {
    setEditingCategory(null);
    setDraftAmount("");
  }

  function saveBudget(category) {
    const numeric = parseFloat(draftAmount);
    if (!draftAmount || isNaN(numeric) || numeric <= 0) return;
    setBudget(category, numeric);
    cancelEdit();
  }

  function removeBudget(category) {
    if (window.confirm(`Remove the budget for ${category}?`)) {
      deleteBudget(category);
    }
  }

  const totalBudget = Object.values(budgets).reduce((sum, v) => sum + v, 0);
  const totalSpentInBudgeted = Object.keys(budgets).reduce(
    (sum, cat) => sum + (currentMonthCategoryTotals[cat] || 0),
    0
  );
  const totalAvailable = totalBudget - totalSpentInBudgeted;

  return (
    <div className="budgets-page">
      <h1 className="page-title">Budgets</h1>
      <p className="budgets-subtitle">
        Set a monthly limit per category. Progress below reflects spending this calendar month.
      </p>

      {totalBudget > 0 && (
        <div className="budgets-summary">
          <div className="budgets-summary-card">
            <span className="budgets-summary-label">Total Budget</span>
            <span className="budgets-summary-value">${totalBudget.toFixed(2)}</span>
          </div>
          <div className="budgets-summary-card">
            <span className="budgets-summary-label">Expenses</span>
            <span className="budgets-summary-value expense">${totalSpentInBudgeted.toFixed(2)}</span>
          </div>
          <div className="budgets-summary-card">
            <span className="budgets-summary-label">Available</span>
            <span className={`budgets-summary-value ${totalAvailable < 0 ? "over" : "available"}`}>
              ${totalAvailable.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      <div className="budgets-grid">
        {categories.map((category) => {
          const spent = currentMonthCategoryTotals[category] || 0;
          const budget = budgets[category];
          const hasBudget = typeof budget === "number";
          const percent = hasBudget ? Math.min((spent / budget) * 100, 100) : 0;
          const overBudget = hasBudget && spent > budget;
          const isEditing = editingCategory === category;

          return (
            <div className="budget-card" key={category}>
              <div className="budget-card-header">
                <h3>{category}</h3>
                {hasBudget && !isEditing && (
                  <div className="budget-card-actions">
                    <button className="icon-btn edit" onClick={() => startEdit(category)} title="Edit budget">
                      <Pencil size={14} />
                    </button>
                    <button className="icon-btn delete" onClick={() => removeBudget(category)} title="Remove budget">
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>

              {isEditing ? (
                <div className="budget-edit-row">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    autoFocus
                    className="budget-input"
                    placeholder="Monthly limit"
                    value={draftAmount}
                    onChange={(e) => setDraftAmount(e.target.value)}
                  />
                  <button className="icon-btn confirm" onClick={() => saveBudget(category)} title="Save">
                    <Check size={16} />
                  </button>
                  <button className="icon-btn cancel" onClick={cancelEdit} title="Cancel">
                    <X size={16} />
                  </button>
                </div>
              ) : hasBudget ? (
                <>
                  <div className="budget-amounts">
                    <span className="budget-spent">${spent.toFixed(2)}</span>
                    <span className="budget-limit"> / ${budget.toFixed(2)}</span>
                  </div>
                  <div className="budget-bar-track">
                    <div
                      className={`budget-bar-fill ${overBudget ? "over" : percent > 80 ? "warn" : ""}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  {overBudget && (
                    <p className="budget-warning">
                      Over budget by ${(spent - budget).toFixed(2)}
                    </p>
                  )}
                </>
              ) : (
                <button className="set-budget-btn" onClick={() => startEdit(category)}>
                  Set a budget
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BudgetsPage;
