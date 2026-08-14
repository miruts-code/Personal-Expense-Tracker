export const initialState = {
  transactions: [],
  editingId: null,
  categories: ["Food", "Transportation", "Housing", "Clothes", "Entertainment"],
  budgets: {},
};

 function transactionReducer(state, action) {
  switch (action.type) {
    case "LOAD_TRANSACTIONS":
      return { ...state, transactions: action.payload };

    case "LOAD_CATEGORIES":
      return { ...state, categories: action.payload };

    case "LOAD_BUDGETS":
      return { ...state, budgets: action.payload };

    case "SET_BUDGET": {
      const { category, amount } = action.payload;
      return { ...state, budgets: { ...state.budgets, [category]: amount } };
    }

    case "DELETE_BUDGET": {
      const rest = { ...state.budgets };
      delete rest[action.payload];
      return { ...state, budgets: rest };
    }

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