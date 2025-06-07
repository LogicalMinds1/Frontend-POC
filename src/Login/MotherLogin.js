import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ setToken }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Form state
  const [motherId, setMotherId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobilenumber, setMobilenumber] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSignPassword, setShowSignPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("https://poc-pregnancy.onrender.com/motherlogin", {
        motherId,
        password,
      });

      if (response.status === 200 && response.data.token) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("mother_id", motherId);
        navigate("/home");
      } else {
        setError("Login failed. Please check credentials.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("https://poc-pregnancy.onrender.com/reg-mother", {
        name,
        motherId,
        email,
        mobilenumber,
        password,
        conformpassword: confirmPassword,
      });

      if (response.status === 201) {
        setSuccess("Registration successful! Please login.");
        setName("");
        setMotherId("");
        setEmail("");
        setMobilenumber("");
        setPassword("");
        setConfirmPassword("");
        setIsLogin(true);
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className={`auth-card ${isLogin ? "login" : "signup"}`}>
        <h2 className="auth-title">{isLogin ? "Mother Login" : "Mother Sign Up"}</h2>
        
        {error && <div className="auth-message error">{error}</div>}
        {success && <div className="auth-message success">{success}</div>}

        <form onSubmit={isLogin ? handleLogin : handleSignUp} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-input"
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Mother ID</label>
            <input
              type={isLogin ? "text" : "number"}
              value={motherId}
              onChange={(e) => setMotherId(e.target.value)}
              required
              className="form-input"
              placeholder="Enter your mother ID"
            />
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-input"
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <input
                  type="tel"
                  value={mobilenumber}
                  onChange={(e) => setMobilenumber(e.target.value)}
                  required
                  className="form-input"
                  placeholder="Enter your mobile number"
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-input">
              <input
                type={isLogin ? (showPassword ? "text" : "password") : (showSignPassword ? "text" : "password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => isLogin ? setShowPassword(!showPassword) : setShowSignPassword(!showSignPassword)}
                className="password-toggle"
              >
                {isLogin 
                  ? (showPassword ? "👁️" : "🙈")
                  : (showSignPassword ? "👁️" : "🙈")}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="password-input">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="form-input"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle"
                >
                  {showConfirmPassword ? "👁️" : "🙈"}
                </button>
              </div>
            </div>
          )}

          <button type="submit" className="auth-button">
            {isLogin ? "Login" : "Sign Up"}
          </button>

          <div className="auth-toggle">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setSuccess("");
              }}
              className="auth-toggle-button"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// CSS Styles
const styles = `
  .auth-container {
    display: flex;
    min-height: 100vh;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 20px;
  }

  .auth-card {
    width: 100%;
    max-width: 420px;
    padding: 2.5rem;
    border-radius: 16px;
    background: white;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  .auth-card.login {
    max-width: 380px;
  }

  .auth-title {
    color: #2c3e50;
    text-align: center;
    margin-bottom: 1.8rem;
    font-size: 1.8rem;
    font-weight: 600;
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-label {
    font-size: 0.95rem;
    color: #4a5568;
    font-weight: 500;
  }

  .form-input {
    padding: 0.8rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.2s;
    background-color: #f8fafc;
  }

  .form-input:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
    background-color: white;
  }

  .password-input {
    position: relative;
  }

  .password-toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    color: #718096;
    padding: 0.3rem;
  }

  .auth-button {
    padding: 0.8rem;
    background: linear-gradient(135deg, #4a90e2 0%, #3b82f6 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 0.5rem;
  }

  .auth-button:hover {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
  }

  .auth-button:active {
    transform: translateY(0);
  }

  .auth-message {
    padding: 0.8rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    text-align: center;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .error {
    background-color: #fee2e2;
    color: #dc2626;
    border: 1px solid #fca5a5;
  }

  .success {
    background-color: #dcfce7;
    color: #16a34a;
    border: 1px solid #86efac;
  }

  .auth-toggle {
    text-align: center;
    margin-top: 1.5rem;
    color: #4a5568;
    font-size: 0.95rem;
  }

  .auth-toggle-button {
    background: none;
    border: none;
    color: #4a90e2;
    cursor: pointer;
    font-weight: 500;
    margin-left: 0.3rem;
    text-decoration: underline;
    font-size: 0.95rem;
  }

  .auth-toggle-button:hover {
    color: #3b82f6;
  }
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Login;