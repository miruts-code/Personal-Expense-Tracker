export const initialState = {
  expenses: [],
  editingId: null,
  categories: ["Food", "Transportation", "Housing", "Clothes", "Entertainment"],
  budgets: {},
};

function expenseReducer(state, action) {
  switch (action.type) {
    case "LOAD_EXPENSES":
      return { ...state, expenses: action.payload };

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

    case "ADD_EXPENSE": {
      const newExpense = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...action.payload,
        type: "expense",
      };
      return { ...state, expenses: [...state.expenses, newExpense] };
    }

    case "EDIT_EXPENSE": {
      const { id, data } = action.payload;
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense.id === id ? { ...expense, ...data, type: "expense" } : expense
        ),
        editingId: null,
      };
    }

    case "DELETE_EXPENSE":
      return {
        ...state,
        expenses: state.expenses.filter((expense) => expense.id !== action.payload),
      };

    case "SET_EDITING_ID":
      return { ...state, editingId: action.payload };

    default:
      return state;
  }
}
export default expenseReducer;