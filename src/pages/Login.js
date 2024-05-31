// // Filename - pages/Login.js

// import { useState, useEffect } from "react";
// import "./Login.css";
// import {
//   signInWithEmailAndPassword,
//   onAuthStateChanged,
//   signOut
// } from "firebase/auth";
// import { auth } from "../firebase-config";
// import { Navigate, useNavigate } from "react-router-dom";

// function Login({setIsAuth, setEmail}) {
//   const [loginEmail, setLoginEmail] = useState("");
//   const [loginPassword, setLoginPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [user, setUser] = useState(null);

//   let navigate = useNavigate();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });

//     return () => {
//       unsubscribe();
//     };
//   }, []);

//   const login = async (event) => {
//     event.preventDefault();
//     try {
//       const userCredential = await signInWithEmailAndPassword(
//         auth,
//         loginEmail,
//         loginPassword
//       );
//       setUser(userCredential.user);
//       setMessage("Login Successful!");
//     } catch (error) {
//       setMessage("Please retry");
//     } finally {
//       setIsAuth(true);
//       setEmail(loginEmail);
//       navigate("/Home");
//     }
//   };

//   const logout = async () => {
//     await signOut(auth);
//     setIsAuth(false);
//     setUser(null);
//     setMessage("Logged out successfully.");
//   };

//   return (
//     <div className="login-container">
//       <h1>Honey Pot</h1>
//       <form onSubmit={login}>
//         <input
//           type="email"
//           placeholder="Email"
//           required
//           onChange={(event) => setLoginEmail(event.target.value)}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           required
//           onChange={(event) => setLoginPassword(event.target.value)}
//         />
//         <div className="button-container">
//           <button type="submit">Login</button>
//         </div>
//         <div className="button-container">
//           <button type="button" onClick={() => { /* Add registration functionality here */ }}>Register</button>
//         </div>
//       </form>
//       <div className="button-container">
//         <button onClick={logout}>Log out</button>
//       </div>
//       {user && <div>{`Logged in as: ${user.email}`}</div>}
//       {message && <h2>{message}</h2>}
//     </div>
//   );
// }

// export default Login;

import { useState, useEffect } from "react";
import "./Login.css";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";

function Login({ setIsAuth, setEmail }) {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsAuth(true);
        setEmail(currentUser.email);
        // navigate("/Home");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [setIsAuth, setEmail, navigate]);

  const login = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      setUser(userCredential.user);
      setIsAuth(true);
      setEmail(loginEmail);
      // setMessage("Login Successful!");
      navigate("/Home");
    } catch (error) {
      setMessage("Please retry");
    }
  };

  const logout = async () => {
    await signOut(auth);
    setIsAuth(false);
    setUser(null);
    // setMessage("Logged out successfully.");
    navigate("/");
  };

  const register = async () => {
    
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
      <div className="button-container">
        <button onClick={logout}>Log out</button>
      </div>
      {/* {user && <div>{`Logged in as: ${user.email}`}</div>} */}
      {message && <h2>{message}</h2>} 
    </div>
  );
}

export default Login;
