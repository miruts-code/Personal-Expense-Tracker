import { useExpenses } from "../contexts/ExpenseContext";
import ExpenseForm from "../components/expenses/ExpenseForm";
import ExpenseList from "../components/expenses/ExpenseList";
import "./ExpensePage.css";

function ExpensesPage() {
  const { expenses, deleteExpense, setEditingId, categoryTotals } = useExpenses();

  const sorted = [...expenses]
    .filter((expense) => expense.type === "expense")
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const maxCategoryValue = Math.max(...Object.values(categoryTotals), 1);
  const hasCategoryData = Object.keys(categoryTotals).length > 0;

  function handleDelete(id) {
    if (window.confirm("Delete this expense? This cannot be undone.")) {
      deleteExpense(id);
      setEditingId(null);
    }
  }

  return (
    <div className="expenses-page">
      <h1 className="page-title">Expenses</h1>

      <div className="expenses-layout">
        <section className="expenses-list-section">
          <h2>Recent Expenses</h2>
          <ExpenseList
            expenses={sorted}
            onEdit={setEditingId}
            onDelete={handleDelete}
            emptyMessage="No expenses yet — add your first one to the right."
          />

          {hasCategoryData && (
            <div className="category-breakdown">
              <h2>Expenses by Category</h2>
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
          )}
        </section>

        <section className="expenses-form-section">
          <ExpenseForm />
        </section>
      </div>
    </div>
  );
}

export default ExpensesPage;
