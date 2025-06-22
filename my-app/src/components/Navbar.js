import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">Hands2Heart</Link>
        <div className="navbar-links">
          <Link to="/signup" className="navbar-link">Sign Up</Link>
          <Link to="/login" className="navbar-link">Login</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
