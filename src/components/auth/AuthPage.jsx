import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import "./AuthPage.css";
function AuthPage({ initialMode = "login", onBack }) {
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup, login } = useAuth();

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [submitError, setSubmitError] = useState("");
  function clearErrors() {
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setSubmitError('')
  }
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
   
  function handleSubmit() {
    clearErrors();
    let haserror = false;

    if (mode === "signup" && name.trim() === "") {
      setNameError("Name is required");
      haserror = true;
    }
    if (!email.trim() || !isValidEmail(email)) {
      setEmailError("Please enter a valid email address");
      haserror = true;
    }
    if (!password) {
      setPasswordError("Password is required");
      haserror = true;
    } else if (mode === "signup" && password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      haserror = true;
    }
    if (mode === "signup" && password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      haserror = true;
    }
    if (haserror) return;
    const result = mode === 'signup' ? signup(name, email, password) : login(email, password);
    if (!result.success) {
      setSubmitError(result.message)
    }
  }
  function switchMode(newmode) {
    setMode(newmode);
    clearErrors();
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }
  return (
    <div className="auth-container">
      {onBack && (
        <button type="button" className="auth-back-btn" onClick={onBack}>
          ← Back
        </button>
      )}
      <form
         className="auth-form"
          noValidate    
         onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {mode === "signup" && (
          <>
            <label className="form-label" htmlFor="name">
              Name
            </label>
            <input
              className={`form-input ${nameError ? "error" : ""}`}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError("");
              }}
              type="text"
              id="name"
              placeholder="e.g. Miruts"
            />
            {nameError && <div className="error-message">{nameError}</div>}
          </>
        )}
        <label className="form-label" htmlFor="email">
          Email
        </label>
        <input
          className={`form-input ${emailError ? "error" : ""}`}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError("");
          }}
          type="email"
          id="email"
          placeholder="e.g. miruts@example.com"
        />
        {emailError && <p className="error-message">{emailError}</p>}

        <label className="form-label" htmlFor="password">
          Password
        </label>
        <div className="password-input-wrapper">
          <input
            className={`form-input ${passwordError ? "error" : ""}`}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError("");
            }}
            type={showPassword ? "text" : "password"}
            id="password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="password-toggle-btn"
          >
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
        {passwordError && <p className="error-message">{passwordError}</p>}
        {mode === "signup" && (
          <>
            <label className="form-label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="password-input-wrapper">
              <input
                className={`form-input ${confirmPasswordError ? "error" : ""}`}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setConfirmPasswordError("");
                }}
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="password-toggle-btn"
              >
                {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
            {confirmPasswordError && (
              <p className="error-message">{confirmPasswordError}</p>
            )}
          </>
        )}

        <button className="auth-submit-btn" type="submit">
          {mode === "login" ? "Login" : "create account"}
        </button>
        {submitError && (
          <p className='error-message'>
            {submitError}
          </p>
        )}
      </form>
    </div>
  );
}
export default AuthPage;
