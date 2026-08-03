import { useContext, createContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [users, setUsers] = useLocalStorage("expense-tracker-users", []);
  const [currentUser, setCurrentUser] = useLocalStorage("expense-tracker-current-user", null);
  function signup(name,email, password) {
    const userExists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (userExists) {
      return { success: false, message: "an account with this user exists" };
    }
    const newUser = { id: crypto.randomUUID(), name, email, password };
    setUsers([...users, newUser]);
    setCurrentUser({ id: newUser.id, name: newUser.name, email: newUser.email });
    return { success: true };
  }

  function login(email, password) {
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
      setCurrentUser({ id: user.id, name: user.name, email: user.email });
      return { success: true };
    }
    return { success: false, message: "incorrect email or password" };
  }
  function logout() {
    setCurrentUser(null);
  }
  return (
    <AuthContext.Provider value={{ currentUser, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
function useAuth() {
  return useContext(AuthContext);
}
export { useAuth };
export default AuthProvider;