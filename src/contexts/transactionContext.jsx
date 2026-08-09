import { createContext, useContext, useReducer, useEffect, useMemo } from "react";
import { transactionReducer, initialState } from "./transactionReducer";
import { useAuth } from "./AuthContext";

const TransactionContext = createContext();

export function TransactionProvider({ children }) {
  const { currentUser } = useAuth();
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  const txKey = currentUser ? `transactions_${currentUser.id}` : null;
  const catKey = currentUser ? `categories_${currentUser.id}` : null;

  useEffect(() => {
    if (!txKey || !catKey) return;
    const storedTx = localStorage.getItem(txKey);
    const storedCat = localStorage.getItem(catKey);
    dispatch({ type: "LOAD_TRANSACTIONS", payload: storedTx ? JSON.parse(storedTx) : [] });
    dispatch({
      type: "LOAD_CATEGORIES",
      payload: storedCat ? JSON.parse(storedCat) : initialState.categories,
    });
  }, [txKey, catKey]);

  useEffect(() => {
    if (!txKey) return;
    localStorage.setItem(txKey, JSON.stringify(state.transactions));
  }, [state.transactions, txKey]);

  useEffect(() => {
    if (!catKey) return;
    localStorage.setItem(catKey, JSON.stringify(state.categories));
  }, [state.categories, catKey]);

  const addTransaction = (data) => dispatch({ type: "ADD_TRANSACTION", payload: data });
  const editTransaction = (id, data) => dispatch({ type: "EDIT_TRANSACTION", payload: { id, data } });
  const deleteTransaction = (id) => dispatch({ type: "DELETE_TRANSACTION", payload: id });
  const setEditingId = (id) => dispatch({ type: "SET_EDITING_ID", payload: id });
  const addCategory = (name) => dispatch({ type: "ADD_CATEGORY", payload: name });

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

  const value = {
    transactions: state.transactions,
    categories: state.categories,
    editingId: state.editingId,
    addTransaction,
    editTransaction,
    deleteTransaction,
    setEditingId,
    addCategory,
    totals,
    categoryTotals,
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