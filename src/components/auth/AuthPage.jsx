import { useState } from "react";
import './AuthPage.css';
function AuthPage() {
    const [mode, setMode] = useState("login");
    function handleSubmit() {
        
    }
    return (
        <div className="auth-container">
                <h1 className="auth-title">Welcome to Personal Expense Tracker</h1>
                <form  classname='auth-form' onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}>
                <div className="auth-toggle">
                        <button className={mode === "login" ? 'active' : ''}
                            type="button"
                        onClick={() => setMode("login")}>Login</button>
                        <button className={mode === "signup" ? 'active' : ''}
                            type="button"
                        onClick={() => setMode("signup")}>Sign Up</button>
                </div>
                {mode === 'signup' && (
                    <>
                            <label className='form-label' htmlFor="name">Name</label>
                            <input className='form-input' type="text" id="name"  />       
                    </>
                )
                    }
                    <label className='form-label' htmlFor="email">Email</label>
                    <input className='form-input' type="email" id="email" />
                    
                    <label className='form-label' htmlFor="password">Password</label>
                    <input className='form-input' type="password" id="password" />
                    {mode === 'signup' && (
                        <>
                            <label className='form-label' htmlFor="confirmPassword">Confirm Password</label>
                            <input className='form-input' type="password" id="confirmPassword" />
                        </>
                    )}
                    
                    <button className='auth-submit-btn' type="submit">{mode === "login" ? "Login" : "create account"}</button>
                    </form>
            </div>
    )
}
export default AuthPage;
