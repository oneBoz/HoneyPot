import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "firebase/auth";
import { db, auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, setDoc } from "firebase/firestore";

function SignUp() {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [message, setMessage] = useState("");

  let navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {

    });

    return () => {
      unsubscribe();
    };
  }, []);

  const register = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      
      const colRef = collection(db, registerEmail);
      const data = {
        Budget: 0,
      }
      await addDoc(colRef, data);
      setMessage("Register Successful!");

    } catch (error) {
      setMessage("Please retry");
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
        {/* {user && <div>{`${user.email}`}</div>} */}
        {message && <h2>{message}</h2>}
      </div>
    </div>
  );
}

export default SignUp;
