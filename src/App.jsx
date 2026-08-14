import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./components/auth/AuthPage";
import { useAuth } from "./contexts/AuthContext";
import { TransactionProvider } from "./contexts/TransactionContext.jsx";
import AppLayout from "./components/layout/AppLayout";
import HomePage from "./pages/HomePage";
import TransactionsPage from "./pages/TransactionsPage";
import HistoryPage from "./pages/HistoryPage";
import BudgetsPage from "./pages/BudgetsPage";

function App() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <div className="app-container">
        <AuthPage />
      </div>
    );
  }

  return (
    <div className="app-container">
    <TransactionProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/budgets" element={<BudgetsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TransactionProvider>
    </div>);
}

export default App;
