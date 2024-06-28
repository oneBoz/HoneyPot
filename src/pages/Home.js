// export default Home;

import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import '../css/Home.css';

/**
 * Home component renders the main page of the financial planning application.
 * It handles user authentication and provides navigation to different features.
 * 
 * @component
 * @example
 * return (
 *   <Home />
 * )
 */
function Home() {
  const [email, setEmail] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  /**
   * Toggles the state of the dropdown menu.
   */
  const toggleMenu = () => {
    setMenuOpen(prevState => !prevState);
  };

  useEffect(() => {
    /**
     * Checks the authentication state and updates the email state or redirects the user.
     * 
     * @param {import('firebase/auth').User | null} currentUser - The current user from Firebase authentication.
     */
    const checkAuthState = async (currentUser) => {
      if (currentUser) {
        setEmail(currentUser.email);
      } else {
        navigate("/");
      }
    };

    const unsubscribe = onAuthStateChanged(auth, checkAuthState);

    // Clean up the subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [navigate]);

  useEffect(() => {
    /**
     * Closes the dropdown menu when clicking outside of it.
     * 
     * @param {MouseEvent} event - The click event.
     */
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /**
   * Signs out the current user and redirects to the homepage.
   * 
   * @async
   * @function
   * @returns {Promise<void>} A promise that resolves when the user is signed out.
   */
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setEmail("");
      navigate('/');
    } catch (error) {
      console.error("Error during sign out: ", error);
    }
  };

  /**
   * Navigates to the specified feature page.
   * 
   * @param {string} feature - The feature to navigate to.
   */
  const handleFeatureClick = (feature) => {
    navigate(`/${feature}`);
  };

  return (
    <div>
      <header>
        <h1>HoneyPot Financial Planning</h1>
      </header>

      <nav>
        {/* Menu Icon */}
        <div className="menu-icon" onClick={toggleMenu} aria-label="Menu">
          &#9776; {/* Unicode for hamburger icon */}
        </div>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="dropdown-menu" ref={menuRef}>
            <Link to="/" aria-label="Home">Home</Link>
            <Link onClick={handleLogout} aria-label="Logout">Logout</Link>
            <Link to="/signup" aria-label="Sign Up">Sign Up</Link>
          </div>
        )}
        <Link to='/Home' aria-label="Home">Home</Link>
      </nav>

      <div className="container">
        <section className="content">
          <h1>Welcome to HoneyPot</h1>
          <p>Empowering you to take control of your finances and achieve your financial goals.</p>

          <button className="feature" id="financial-news" aria-label="Financial News feature" onClick={() => handleFeatureClick('FinancialNews')}>
            <h2>Financial News</h2>
            <p>Enrich your financial understanding</p>
          </button>

          <button className="feature" id="expenses" aria-label="Expenses feature" onClick={() => handleFeatureClick('Expenses')}>
            <h2>Expenses</h2>
            <p>Log and categorize your expenses to understand your spending habits.</p>
          </button>

          <button className="feature" id="investments" aria-label="Investments feature" onClick={() => handleFeatureClick('Investment')}>
            <h2>Investments</h2>
            <p>Monitor the performance of your investment portfolios.</p>
            <p>(Coming soon)</p>
          </button>
        </section>
      </div>
    </div>
  );
}

export default Home;
