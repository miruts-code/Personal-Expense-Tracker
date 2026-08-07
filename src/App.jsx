import Authpage from "./components/auth/Authpage";
import {useAuth} from "./contexts/AuthContext";
function App() {
  const {currentUser, logout} = useAuth();
  return (
    <div className="app-container">
     {!currentUser&& <Authpage />} 
     {currentUser &&(
      <div>
        <h1>Welcome, {currentUser.name}!</h1>
        <button onClick={logout}>Logout</button>
      </div>
     )}
    </div>
  );
}
export default App;
