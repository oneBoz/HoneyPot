// export default Login;
import "../css/Login.css";
import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";

/**
 * Login component handles user authentication.
 * Users can login with their email and password or navigate to the sign-up page.
 * 
 * @component
 * @example
 * return (
 *   <Login />
 * )
 */
function Login() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    /**
     * Checks the authentication state and navigates accordingly.
     * 
     * @param {import('firebase/auth').User | null} currentUser - The current user from Firebase authentication.
     */
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        navigate("/Home");
      } else {
        navigate("/");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigate]);

  /**
   * Handles user login.
   * Attempts to sign in the user with email and password.
   * 
   * @param {React.FormEvent<HTMLFormElement>} event - The form submit event.
   * @async
   * @returns {Promise<void>} A promise that resolves when the login process is complete.
   */
  const login = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      navigate("/Home");
    } catch (error) {
      setMessage("Please retry");
    }
  };

  /**
   * Navigates to the registration page.
   */
  const register = () => {
    navigate("/SignUp");
  };

  return (
    <div className="login-container">
      <h1>Honey Pot</h1>
      <form onSubmit={login}>
        <input
          type="email"
          placeholder="Email"
          required
          onChange={(event) => setLoginEmail(event.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          onChange={(event) => setLoginPassword(event.target.value)}
        />
        <div className="button-container">
          <button type="submit">Login</button>
        </div>
        <div className="button-container">
          <button type="button" onClick={register}>Register</button>
        </div>
      </form>
      {message && <h2>{message}</h2>}
    </div>
  );
}

export default Login;
