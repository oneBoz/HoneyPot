import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "../firebase-config";
import '../css/News.css'; // Assuming the CSS is in Home.css

// function News() {
//   const [email, setEmail] = useState("");
//   const [menuOpen, setMenuOpen] = useState(false);
//   const menuRef = useRef(null);
//   const navigate = useNavigate();

//   const toggleMenu = () => {
//     setMenuOpen(!menuOpen);
//   };

//   useEffect(() => {
//     const checkAuthState = async (currentUser) => {
//       if (currentUser) {
//         setEmail(currentUser.email);
//       } else {
//         navigate("/");
//       }
//     };

//     const unsubscribe = onAuthStateChanged(auth, checkAuthState);

//     return () => {
//       unsubscribe();
//     };
//   }, [navigate]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setMenuOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [menuRef]);

//   const handleLogout = async () => {
//     await signOut(auth);
//     setEmail("");
//     navigate('/');
//   };

//   const handleFeatureClick = (feature) => {
//     navigate(`/${feature}`);
//   };

//   return (
//     <div>
      // <nav>
      //   {/* Menu Icon */}
      //   <div className="menu-icon" onClick={toggleMenu}>
      //     &#9776; {/* Unicode for hamburger icon */}
      //   </div>

      //   {/* Dropdown Menu */}
      //   {menuOpen && (
      //     <div className="dropdown-menu" ref={menuRef}>
      //       <Link to="/">Home</Link>
      //       <Link onClick={handleLogout}>Logout</Link>
      //       <Link to="/signup">Sign Up</Link>
      //     </div>
      //   )}
      //   <Link onClick={handleLogout}>Log out</Link>
      //   <Link to='/SignUp'>Sign Up</Link>
      //   <Link to='/Home'>Home</Link>
      // </nav>

//     </div>
//   );
// }

// export default News;

function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const newsContainerRef = useRef(null); // Ref for accessing the container element

  const [email, setEmail] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

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

  // Scroll to top function
  const scrollToTop = () => {
    if (newsContainerRef.current) {
      newsContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth' // Optional smooth scrolling
      });
    }
  };

  // Scroll to bottom function (if needed)
  const scrollToBottom = () => {
    if (newsContainerRef.current) {
      newsContainerRef.current.scrollTo({
        top: newsContainerRef.current.scrollHeight,
        behavior: 'smooth' // Optional smooth scrolling
      });
    }
  };

  

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

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

  const handleLogout = async () => {
    await signOut(auth);
    setEmail("");
    navigate('/');
  };

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
            <Link to="/signup">Sign Up</Link>
          </div>
        )}
        {/* <Link onClick={handleLogout}>Log out</Link>
        <Link to='/SignUp'>Sign Up</Link> */}
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