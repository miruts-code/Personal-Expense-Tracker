import Authpage from "./components/auth/Authpage";
import {useAuth} from "./contexts/AuthContext";
import TransactionForm from "./components/transactions/TransactionForm";
import Dashboard from "./components/dashboard/Dashboard";
import { TransactionProvider } from './contexts/TransactionContext.jsx'
function App() {
  const {currentUser, logout} = useAuth();
  return (
    <div className="app-container">
     {!currentUser&& <Authpage />} 
     {currentUser &&(
      <TransactionProvider>
      <div>
          <div style={{ padding: "16px", display: "flex", justifyContent: "space-between" }}>
            <p>Welcome,  {currentUser.name || currentUser.email}</p>
            <button onClick={logout}>Log Out</button>
          </div>

          <Dashboard />
          <div style={{ marginTop: "40px" }}>
            <TransactionForm />
          </div>
        </div>
      </TransactionProvider>)}
    </div>
     
    
  );
}
export default App;
