import { createContext, useContext, useReducer, useEffect, useMemo } from "react";
import transactionReducer,{ initialState } from "./TransactionReducer";
import { useAuth } from "./AuthContext";

const TransactionContext = createContext();

export function TransactionProvider({ children }) {
  const { currentUser } = useAuth();
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  const txKey = currentUser ? `transactions_${currentUser.id}` : null;
  const catKey = currentUser ? `categories_${currentUser.id}` : null;
  const budgetKey = currentUser ? `budgets_${currentUser.id}` : null;

  useEffect(() => {
    if (!txKey || !catKey || !budgetKey) return;
    const storedTx = localStorage.getItem(txKey);
    const storedCat = localStorage.getItem(catKey);
    const storedBudgets = localStorage.getItem(budgetKey);
    dispatch({ type: "LOAD_TRANSACTIONS", payload: storedTx ? JSON.parse(storedTx) : [] });
    dispatch({
      type: "LOAD_CATEGORIES",
      payload: storedCat ? JSON.parse(storedCat) : initialState.categories,
    });
    dispatch({
      type: "LOAD_BUDGETS",
      payload: storedBudgets ? JSON.parse(storedBudgets) : initialState.budgets,
    });
  }, [txKey, catKey, budgetKey]);

  useEffect(() => {
    if (!txKey) return;
    localStorage.setItem(txKey, JSON.stringify(state.transactions));
  }, [state.transactions, txKey]);

  useEffect(() => {
    if (!catKey) return;
    localStorage.setItem(catKey, JSON.stringify(state.categories));
  }, [state.categories, catKey]);

  useEffect(() => {
    if (!budgetKey) return;
    localStorage.setItem(budgetKey, JSON.stringify(state.budgets));
  }, [state.budgets, budgetKey]);

  const addTransaction = (data) => dispatch({ type: "ADD_TRANSACTION", payload: data });
  const editTransaction = (id, data) => dispatch({ type: "EDIT_TRANSACTION", payload: { id, data } });
  const deleteTransaction = (id) => dispatch({ type: "DELETE_TRANSACTION", payload: id });
  const setEditingId = (id) => dispatch({ type: "SET_EDITING_ID", payload: id });
  const addCategory = (name) => dispatch({ type: "ADD_CATEGORY", payload: name });
  const setBudget = (category, amount) => dispatch({ type: "SET_BUDGET", payload: { category, amount } });
  const deleteBudget = (category) => dispatch({ type: "DELETE_BUDGET", payload: category });

  const totals = useMemo(() => {
    return state.transactions.reduce(
      (acc, t) => {
        if (t.type === "income") acc.income += t.amount;
        else acc.expenses += t.amount;
        acc.balance = acc.income - acc.expenses;
        return acc;
      },
      { balance: 0, income: 0, expenses: 0 }
    );
  }, [state.transactions]);

  const categoryTotals = useMemo(() => {
    return state.transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
  }, [state.transactions]);

  const currentMonthCategoryTotals = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    return state.transactions
      .filter((t) => {
        if (t.type !== "expense" || !t.date) return false;
        const d = new Date(t.date);
        return d.getMonth() === month && d.getFullYear() === year;
      })
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
  }, [state.transactions]);

  const value = {
    transactions: state.transactions,
    categories: state.categories,
    editingId: state.editingId,
    budgets: state.budgets,
    addTransaction,
    editTransaction,
    deleteTransaction,
    setEditingId,
    addCategory,
    setBudget,
    deleteBudget,
    totals,
    categoryTotals,
    currentMonthCategoryTotals,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  return useContext(TransactionContext);
}