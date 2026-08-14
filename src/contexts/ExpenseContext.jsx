import { createContext, useContext, useReducer, useEffect, useMemo } from "react";
import expenseReducer, { initialState } from "./ExpenseReducer";
import { useAuth } from "./AuthContext";

const ExpenseContext = createContext();

function normalizeBudgets(value) {
  if (!value || typeof value !== "object") return {};

  return Object.fromEntries(
    Object.entries(value).map(([category, amount]) => [
      category,
      Number(amount) || 0,
    ])
  );
}

export function ExpenseProvider({ children }) {
  const { currentUser } = useAuth();
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  const expenseKey = currentUser ? `expenses_${currentUser.id}` : null;
  const catKey = currentUser ? `categories_${currentUser.id}` : null;
  const budgetKey = currentUser ? `budgets_${currentUser.id}` : null;

  useEffect(() => {
    if (!expenseKey || !catKey || !budgetKey) return;
    const storedExpenses = localStorage.getItem(expenseKey);
    const storedCat = localStorage.getItem(catKey);
    const storedBudgets = localStorage.getItem(budgetKey);
    dispatch({ type: "LOAD_EXPENSES", payload: storedExpenses ? JSON.parse(storedExpenses) : [] });
    dispatch({
      type: "LOAD_CATEGORIES",
      payload: storedCat ? JSON.parse(storedCat) : initialState.categories,
    });
    dispatch({
      type: "LOAD_BUDGETS",
      payload: storedBudgets ? normalizeBudgets(JSON.parse(storedBudgets)) : initialState.budgets,
    });
  }, [expenseKey, catKey, budgetKey]);

  useEffect(() => {
    if (!expenseKey) return;
    localStorage.setItem(expenseKey, JSON.stringify(state.expenses));
  }, [state.expenses, expenseKey]);

  useEffect(() => {
    if (!catKey) return;
    localStorage.setItem(catKey, JSON.stringify(state.categories));
  }, [state.categories, catKey]);

  useEffect(() => {
    if (!budgetKey) return;
    localStorage.setItem(budgetKey, JSON.stringify(state.budgets));
  }, [state.budgets, budgetKey]);

  const addExpense = (data) => {
    // Calculate current balance
    const expenses = state.expenses
      .filter((expense) => expense.type === "expense")
      .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
    const budget = Object.values(state.budgets).reduce((sum, value) => sum + Number(value || 0), 0);
    const currentBalance = budget - expenses;

    // Validate: only allow expense if amount doesn't exceed current balance
    if (data.type === "expense" && Number(data.amount) > currentBalance) {
      throw new Error(
        `Insufficient balance. Your current balance is $${currentBalance.toFixed(2)}. Cannot add expense of $${Number(data.amount).toFixed(2)}.`
      );
    }

    dispatch({ type: "ADD_EXPENSE", payload: data });
  };

  const editExpense = (id, data) => {
    // For edits, calculate the difference in amount
    const oldExpense = state.expenses.find((e) => e.id === id);
    if (!oldExpense) throw new Error("Expense not found");

    const amountDifference = Number(data.amount) - Number(oldExpense.amount);

    if (data.type === "expense" && amountDifference > 0) {
      const expenses = state.expenses
        .filter((expense) => expense.type === "expense")
        .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
      const budget = Object.values(state.budgets).reduce((sum, value) => sum + Number(value || 0), 0);
      const currentBalance = budget - expenses;

      if (amountDifference > currentBalance) {
        throw new Error(
          `Insufficient balance for this increase. Your current balance is $${currentBalance.toFixed(2)}.`
        );
      }
    }

    dispatch({ type: "EDIT_EXPENSE", payload: { id, data } });
  };

  const deleteExpense = (id) => dispatch({ type: "DELETE_EXPENSE", payload: id });
  const setEditingId = (id) => dispatch({ type: "SET_EDITING_ID", payload: id });
  const addCategory = (name) => dispatch({ type: "ADD_CATEGORY", payload: name });
  const setBudget = (category, amount) => dispatch({ type: "SET_BUDGET", payload: { category, amount: Number(amount) } });
  const deleteBudget = (category) => dispatch({ type: "DELETE_BUDGET", payload: category });

  const totals = useMemo(() => {
    const expenses = state.expenses
      .filter((expense) => expense.type === "expense")
      .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
    const budget = Object.values(state.budgets).reduce((sum, value) => sum + Number(value || 0), 0);

    return {
      balance: budget - expenses,
      budget,
      expenses,
    };
  }, [state.expenses, state.budgets]);

  const categoryTotals = useMemo(() => {
    return state.expenses
      .filter((expense) => expense.type === "expense")
      .reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount || 0);
        return acc;
      }, {});
  }, [state.expenses]);

  const currentMonthCategoryTotals = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    return state.expenses
      .filter((expense) => {
        if (expense.type !== "expense" || !expense.date) return false;
        const d = new Date(expense.date);
        return d.getMonth() === month && d.getFullYear() === year;
      })
      .reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount || 0);
        return acc;
      }, {});
  }, [state.expenses]);

  const value = {
    expenses: state.expenses,
    categories: state.categories,
    editingId: state.editingId,
    budgets: state.budgets,
    addExpense,
    editExpense,
    deleteExpense,
    setEditingId,
    addCategory,
    setBudget,
    deleteBudget,
    totals,
    categoryTotals,
    currentMonthCategoryTotals,
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  return useContext(ExpenseContext);
}