import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "../firebase-config";
import '../css/News.css'; 


/**
 * News component fetches and displays news articles.
 * Handles authentication state and provides navigation and logout functionality.
 */
function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const newsContainerRef = useRef(null); // Ref for accessing the container element

  const [email, setEmail] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  /**
   * useEffect to fetch news articles from the API when component mounts.
   * Sets articles state with the fetched data or sets error if any.
   */
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('https://newsapi.org/v2/top-headlines?country=us&category=business&pageSize=10&apiKey=d69fd79ca912474f974049523d33522d');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setArticles(data.articles);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  /**
   * Scrolls the news container to the top.
   */
  const scrollToTop = () => {
    if (newsContainerRef.current) {
      newsContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth' // Optional smooth scrolling
      });
    }
  };

  /**
   * Scrolls the news container to the bottom.
   * Uncomment this function if you need to use it.
   */
  const scrollToBottom = () => {
    if (newsContainerRef.current) {
      newsContainerRef.current.scrollTo({
        top: newsContainerRef.current.scrollHeight,
        behavior: 'smooth' // Optional smooth scrolling
      });
    }
  };

  /**
   * Toggles the visibility of the menu.
   */
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  /**
   * useEffect to check the user's authentication state on component mount.
   * Redirects to the home page if the user is not authenticated.
   */
  useEffect(() => {
    const checkAuthState = async (currentUser) => {
      if (currentUser) {
        setEmail(currentUser.email);
      } else {
        navigate("/");
      }
    };

    const unsubscribe = onAuthStateChanged(auth, checkAuthState);

    return () => {
      unsubscribe();
    };
  }, [navigate]);

  /**
   * useEffect to handle clicks outside the menu and close it if open.
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  /**
   * Handles user logout and redirects to the login page.
   */
  const handleLogout = async () => {
    await signOut(auth);
    setEmail("");
    navigate('/');
  };

  /**
   * Handles navigation to different features.
   * @param {string} feature - The feature to navigate to.
   */
  const handleFeatureClick = (feature) => {
    navigate(`/${feature}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <nav>
        {/* Menu Icon */}
        <div className="menu-icon" onClick={toggleMenu}>
          &#9776; {/* Unicode for hamburger icon */}
        </div>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="dropdown-menu" ref={menuRef}>
            <Link to="/">Home</Link>
            <Link onClick={handleLogout}>Logout</Link>
            <Link to="/SignUp">Sign Up</Link>
          </div>
        )}
        <Link to='/Home'>Home</Link>
      </nav>

      <div className="news-grid" ref={newsContainerRef}>
        {articles.map((article, index) => (
          <div key={index} className="card">
            <img src={article.urlToImage || 'default-image.jpg'} className="card-img-top" alt={article.title} title={article.title} />
            <div className="card-body">
              <h2 className="card-title">{article.title}</h2>
              <div className="card-text">
                <p>{article.description}</p>
              </div>
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Read More</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default News;
