import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./components/auth/AuthPage";
import WelcomePage from "./pages/WelcomePage";
import { useAuth } from "./contexts/AuthContext";
import { ExpenseProvider } from "./contexts/ExpenseContext.jsx";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import ExpensesPage from "./pages/ExpensesPage";
import HistoryPage from "./pages/HistoryPage";
import BudgetsPage from "./pages/BudgetsPage";

function App() {
  const { currentUser } = useAuth();
  const [screen, setScreen] = useState("welcome"); // "welcome" | "login" | "signup"

  if (!currentUser) {
    if (screen === "welcome") {
      return (
        <WelcomePage
          onSignIn={() => setScreen("login")}
          onSignUp={() => setScreen("signup")}
        />
      );
    }
    return (
      <AuthPage
        initialMode={screen === "signup" ? "signup" : "login"}
        onBack={() => setScreen("welcome")}
      />
    );
  }

  return (
    <ExpenseProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/budgets" element={<BudgetsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ExpenseProvider>
  );
}

export default App;
