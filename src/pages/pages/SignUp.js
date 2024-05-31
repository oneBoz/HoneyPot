
import { useState, useEffect } from "react";
import "./SignUp.css";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  let navigate = useNavigate();

  const register = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      setMessage("Register Successful!");
      navigate("/");
    } catch (error) {
      setMessage("Please retry");
    }
  };

  return (
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
      {/* {user && <div>{`${user.email}`}</div>} */}
      {message && <h2>{message}</h2>}
    </div>
  );
}

export default SignUp;
