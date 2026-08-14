import { useEffect, useState } from "react";
import { useExpenses } from "../../contexts/ExpenseContext";
import "./ExpenseForm.css";

function ExpenseForm() {
  const {
    addExpense,
    editingId,
    expenses,
    editExpense,
    setEditingId,
    categories,
    addCategory,
    budgets,
  } = useExpenses();

  const editingExpense = expenses.find((expense) => expense.id === editingId);

  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categories[0] || "");
  const [isOther, setIsOther] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const populateForm = (expense) => {
    if (!expense) {
      resetForm();
      return;
    }

    setType("expense");
    setAmount(String(expense.amount ?? ""));
    setCategory(expense.category && categories.includes(expense.category) ? expense.category : "");
    setIsOther(!(expense.category && categories.includes(expense.category)));
    setCustomCategory(expense.category && !categories.includes(expense.category) ? expense.category : "");
    setDescription(expense.description || "");
    setDate(expense.date || "");
  };

  function resetForm() {
    setType("expense");
    setAmount("");
    setCategory(categories[0] || "");
    setIsOther(false);
    setCustomCategory("");
    setDescription("");
    setDate("");
  }

  useEffect(() => {
    if (editingId && editingExpense) {
      populateForm(editingExpense);
      return;
    }

    if (!editingId) {
      resetForm();
    }
  }, [editingId, editingExpense, categories]);

  function handleCategoryChange(e) {
    const value = e.target.value;
    if (value === "__other__") {
      setIsOther(true);
      setCategory("");
    } else {
      setIsOther(false);
      setCategory(value);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const numericAmount = parseFloat(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      setError("Amount must be a positive number.");
      return;
    }
    if (!date) {
      setError("Date is required.");
      return;
    }

    let finalCategory = category;
    if (isOther) {
      const trimmed = customCategory.trim();
      if (!trimmed) {
        setError("Enter a name for the new category.");
        return;
      }
      addCategory(trimmed);
      finalCategory = trimmed;
    }

    const data = { type: "expense", amount: numericAmount, category: finalCategory, description, date };

    const rawBudgetLimit = budgets[finalCategory];
    const budgetLimit = Number(rawBudgetLimit);
    if (Number.isFinite(budgetLimit) && budgetLimit > 0) {
      const txDate = new Date(date);
      const txMonth = txDate.getMonth();
      const txYear = txDate.getFullYear();

      const spentSoFar = expenses
        .filter(
          (expense) =>
            expense.type === "expense" &&
            expense.category === finalCategory &&
            expense.id !== editingId
        )
        .filter((expense) => {
          const d = new Date(expense.date);
          return d.getMonth() === txMonth && d.getFullYear() === txYear;
        })
        .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

      const projectedTotal = spentSoFar + numericAmount;

      if (projectedTotal > budgetLimit) {
        const remaining = budgetLimit - spentSoFar;
        setError(
          remaining > 0
            ? `Not enough budget. Only $${remaining.toFixed(2)} remaining in ${finalCategory}.`
            : `Not enough budget. ${finalCategory} has already reached its limit.`
        );
        return;
      }
    }

    if (editingId) {
      editExpense(editingId, data);
      setSuccessMessage("Expense updated.");
    } else {
      addExpense(data);
      setSuccessMessage("Expense added.");
    }

    resetForm();
    setEditingId(null);
    setTimeout(() => setSuccessMessage(""), 2500);
  }

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <h2 className="form-title">{editingId ? "Edit Expense" : "Add Expense"}</h2>

      <label className="field-label">Amount</label>
      <input
        type="number"
        className="text-input"
        placeholder="0.00"
        min="0"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <label className="field-label">Category</label>
      <select
        className="select-input"
        value={isOther ? "__other__" : category}
        onChange={handleCategoryChange}
      >
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
        <option value="__other__">Other (add new)</option>
      </select>

      {isOther && (
        <input
          type="text"
          className="text-input"
          placeholder="Enter new category name"
          value={customCategory}
          onChange={(e) => setCustomCategory(e.target.value)}
          autoFocus
        />
      )}

      <label className="field-label">Description</label>
      <input
        type="text"
        className="text-input"
        placeholder="e.g. Lunch with friends"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label className="field-label">Date</label>
      <input
        type="date"
        className="text-input"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      {error && <p className="form-error">{error}</p>}
      {successMessage && <p className="form-success">{successMessage}</p>}

      <button type="submit" className="submit-btn">
        {editingId ? "Save Changes" : "Add Expense"}
      </button>
    </form>
  );
}

export default ExpenseForm;