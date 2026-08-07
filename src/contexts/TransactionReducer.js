export const initialState = {
  transactions: [],
  editingId: null,
};

function transactionReducer(state, action) {
  switch (action.type) {
    case "LOAD_TRANSACTIONS":
      return { ...state, transactions: action.payload };

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