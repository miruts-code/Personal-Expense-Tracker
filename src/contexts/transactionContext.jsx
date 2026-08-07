import { createContext, useContext, useReducer, useEffect, useMemo } from "react";
import { transactionReducer, initialState } from "./transactionReducer";
import { useAuth } from "./AuthContext";

const TransactionContext = createContext();

function TransactionProvider({ children }) {
  const { currentUser } = useAuth();
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  const storageKey = currentUser ? `transactions_${currentUser.id}` : null;

  // Load transactions when the logged-in user changes
  useEffect(() => {
    if (!storageKey) return;
    const stored = localStorage.getItem(storageKey);
    dispatch({ type: "LOAD_TRANSACTIONS", payload: stored ? JSON.parse(stored) : [] });
  }, [storageKey]);

  // Persist on every change
  useEffect(() => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(state.transactions));
  }, [state.transactions, storageKey]);

  const addTransaction = (data) => dispatch({ type: "ADD_TRANSACTION", payload: data });
  const editTransaction = (id, data) => dispatch({ type: "EDIT_TRANSACTION", payload: { id, data } });
  const deleteTransaction = (id) => dispatch({ type: "DELETE_TRANSACTION", payload: id });
  const setEditingId = (id) => dispatch({ type: "SET_EDITING_ID", payload: id });

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
    editingId: state.editingId,
    addTransaction,
    editTransaction,
    deleteTransaction,
    setEditingId,
    totals,
    categoryTotals,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

function useTransactions() {
  return useContext(TransactionContext);
}
export { useTransactions };
export default TransactionProvider;