// export default SignUp;

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";

/**
 * SignUp component allows users to register a new account using email and password.
 * It handles form submission, user creation, and displays messages based on registration status.
 *
 * @component
 * @example
 * return (
 *   <SignUp />
 * )
 */
function SignUp() {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    /**
     * Subscribes to Firebase authentication state changes.
     * Navigates the user to the home page if they are already authenticated.
     *
     * @param {import('firebase/auth').User | null} currentUser - The current user from Firebase authentication.
     */
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      
    });

    return () => {
      unsubscribe();
    };
  }, [navigate]);

  /**
   * Registers a new user with Firebase authentication.
   * Creates a new user document in Firestore after successful registration.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
   * @async
   * @returns {Promise<void>} A promise that resolves when the registration process is complete.
   */
  const register = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );

      const colRef = collection(db, registerEmail); // Use user UID for collection reference
      const data = {
        Budget: 0,
      };

      await addDoc(colRef, data);
      setMessage("Register Successful!");
    } catch (error) {
      handleAuthError(error);
    }
  };

  /**
   * Handles Firebase authentication errors and sets appropriate messages.
   *
   * @param {Error} error - The error object from Firebase.
   */
  const handleAuthError = (error) => {
    switch (error.code) {
      case 'auth/email-already-in-use':
        setMessage("Email already in use. Please use a different email.");
        break;
      case 'auth/invalid-email':
        setMessage("Invalid email. Please enter a valid email address.");
        break;
      case 'auth/weak-password':
        setMessage("Weak password. Please enter at least 6 characters.");
        break;
      default:
        setMessage("An error occurred. Please try again.");
        break;
    }
  };

  return (
    <div>
      <nav>
        <Link to='/'>Back</Link>
      </nav>
      <div className="login-container">
        <h1>Honey Pot</h1>
        <form onSubmit={register}>
          <input
            type="email"
            placeholder="Email"
            required
            onChange={(event) => setRegisterEmail(event.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            onChange={(event) => setRegisterPassword(event.target.value)}
          />
          <div className="button-container">
            <button type="submit">Register</button>
          </div>
        </form>
        {message && <h2>{message}</h2>}
      </div>
    </div>
  );
}

export default SignUp;
