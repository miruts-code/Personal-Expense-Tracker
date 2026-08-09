export const initialState = {
  transactions: [],
  editingId: null,
  categories: ["Food", "Transportation", "Housing", "Clothes", "Entertainment"],
};

 function transactionReducer(state, action) {
  switch (action.type) {
    case "LOAD_TRANSACTIONS":
      return { ...state, transactions: action.payload };

    case "LOAD_CATEGORIES":
      return { ...state, categories: action.payload };

    case "ADD_CATEGORY": {
      const trimmed = action.payload.trim();
      if (!trimmed || state.categories.includes(trimmed)) return state;
      return { ...state, categories: [...state.categories, trimmed] };
    }

    case "ADD_TRANSACTION": {
      const newTransaction = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...action.payload,
      };
      return { ...state, transactions: [...state.transactions, newTransaction] };
    }

    case "EDIT_TRANSACTION": {
      const { id, data } = action.payload;
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === id ? { ...t, ...data } : t
        ),
        editingId: null,
      };
    }

    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };

    case "SET_EDITING_ID":
      return { ...state, editingId: action.payload };

    default:
      return state;
  }
}
export default transactionReducer;