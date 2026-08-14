import { useMemo, useState } from "react";
import { useExpenses } from "../contexts/ExpenseContext";
import "./HistoryPage.css";

function monthLabel(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return "Undated";
  return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

function getRangeStart(dateKey) {
  const now = new Date();
  const start = new Date(now);

  if (dateKey === "today") {
    start.setHours(0, 0, 0, 0);
  } else if (dateKey === "week") {
    start.setDate(now.getDate() - 7);
  } else if (dateKey === "month") {
    start.setMonth(now.getMonth() - 1);
  } else if (dateKey === "year") {
    start.setFullYear(now.getFullYear() - 1);
  }

  return start.toISOString().slice(0, 10);
}

const amountRanges = {
  all: () => true,
  "1000-plus": (amount) => amount > 1000,
  "500-1000": (amount) => amount >= 500 && amount <= 1000,
  "100-500": (amount) => amount >= 100 && amount < 500,
  "under-100": (amount) => amount < 100,
};

function HistoryPage() {
  const { expenses, categories } = useExpenses();
  const [timeFilter, setTimeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [amountFilter, setAmountFilter] = useState("all");

  const filtered = useMemo(() => {
    const dateCutoff = timeFilter === "all" ? null : getRangeStart(timeFilter);

    return expenses
      .filter((expense) => expense.type === "expense")
      .filter((expense) => (categoryFilter === "all" ? true : expense.category === categoryFilter))
      .filter((expense) => (dateCutoff ? expense.date >= dateCutoff : true))
      .filter((expense) => amountRanges[amountFilter] ? amountRanges[amountFilter](expense.amount) : true)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses, timeFilter, categoryFilter, amountFilter]);

  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach((t) => {
      const label = monthLabel(t.date);
      if (!groups[label]) groups[label] = [];
      groups[label].push(t);
    });
    return groups;
  }, [filtered]);

  const filteredTotals = useMemo(() => {
    return filtered.reduce(
      (acc, t) => {
        acc.expenses += Number(t.amount || 0);
        return acc;
      },
      { expenses: 0 }
    );
  }, [filtered]);

  function clearFilters() {
    setTimeFilter("all");
    setCategoryFilter("all");
    setAmountFilter("all");
  }

  return (
    <div className="history-page">
      <h1 className="page-title">History</h1>

      <div className="history-filters">
        <div className="filter-field">
          <label>Time</label>
          <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="today">Today</option>
            <option value="week">Within a week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
        </div>

        <div className="filter-field">
          <label>Category</label>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label>Amount</label>
          <select value={amountFilter} onChange={(e) => setAmountFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="1000-plus">Above 1000</option>
            <option value="500-1000">500 - 1000</option>
            <option value="100-500">100 - 500</option>
            <option value="under-100">Less than 100</option>
          </select>
        </div>

        <button className="clear-filters-btn" onClick={clearFilters}>Clear</button>
      </div>

      <div className="history-summary">
        <span>
          <strong>{filtered.length}</strong> expense{filtered.length === 1 ? "" : "s"}
        </span>
        <span className="expense-total">-${filteredTotals.expenses.toFixed(2)}</span>
      </div>

      {filtered.length === 0 ? (
        <p className="history-empty">No expenses match these filters.</p>
      ) : (
        Object.entries(grouped).map(([month, items]) => (
          <div className="history-group" key={month}>
            <h2 className="history-group-title">{month}</h2>
            <div className="history-table">
              {items.map((t) => (
                <div className="history-row" key={t.id}>
                  <span className="history-date">{t.date}</span>
                  <span className="history-desc">{t.description || "—"}</span>
                  <span className="history-category">{t.category}</span>
                  <span className="history-amount expense">-${t.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default HistoryPage;
