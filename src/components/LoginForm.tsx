import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isValidField } from "../utils/validation";
import { useDebounce } from "../hooks/useDebounce";
import "./LoginForm.css";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const debouncedUsername = useDebounce(username, 300);
  const debouncedPassword = useDebounce(password, 300);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Button enable/disable stays on the LIVE value — no reason to lag the button
  const isFormValid = isValidField(username) && isValidField(password);

  // Error messages use the DEBOUNCED value — avoids flicker while typing
  const showUsernameError = debouncedUsername.length > 0 && !isValidField(debouncedUsername);
  const showPasswordError = debouncedPassword.length > 0 && !isValidField(debouncedPassword);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const success = login(username, password);

    if (success) {
      navigate("/table");
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="login-panel">
      <h1 className="login-title">Access Terminal</h1>
      <p className="login-subtitle">// Enter credentials to proceed</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          {showUsernameError && (
            <p className="field-error" role="alert">
              Username must be 4–30 characters.
            </p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {showPasswordError && (
            <p className="field-error" role="alert">
              Password must be 4–30 characters.
            </p>
          )}
        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="login-button" disabled={!isFormValid}>
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
