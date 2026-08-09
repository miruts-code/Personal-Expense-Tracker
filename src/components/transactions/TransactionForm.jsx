import { useState } from "react";
import { useTransactions } from "../../contexts/TransactionContext";
import "./TransactionForm.css";

function TransactionForm() {
  const {
    addTransaction,
    editingId,
    transactions,
    editTransaction,
    setEditingId,
    categories,
    addCategory,
  } = useTransactions();

  const editingTransaction = transactions.find((t) => t.id === editingId);

  const [type, setType] = useState(editingTransaction?.type || "expense");
  const [amount, setAmount] = useState(editingTransaction?.amount ?? "");
  const [category, setCategory] = useState(editingTransaction?.category || categories[0]);
  const [isOther, setIsOther] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [description, setDescription] = useState(editingTransaction?.description || "");
  const [date, setDate] = useState(editingTransaction?.date || "");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function resetForm() {
    setType("expense");
    setAmount("");
    setCategory(categories[0]);
    setIsOther(false);
    setCustomCategory("");
    setDescription("");
    setDate("");
  }

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

    const data = { type, amount: numericAmount, category: finalCategory, description, date };

    if (editingId) {
      editTransaction(editingId, data);
      setSuccessMessage("Transaction updated.");
    } else {
      addTransaction(data);
      setSuccessMessage("Transaction added.");
    }

    resetForm();
    setEditingId(null);
    setTimeout(() => setSuccessMessage(""), 2500);
  }

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <h2 className="form-title">{editingId ? "Edit Transaction" : "Add Transaction"}</h2>

      <div className="type-toggle">
        <button
          type="button"
          className={type === "expense" ? "active" : ""}
          onClick={() => setType("expense")}
        >
          Expense
        </button>
        <button
          type="button"
          className={type === "income" ? "active" : ""}
          onClick={() => setType("income")}
        >
          Income
        </button>
      </div>

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
        {editingId ? "Save Changes" : "Add Transaction"}
      </button>
    </form>
  );
}

export default TransactionForm;