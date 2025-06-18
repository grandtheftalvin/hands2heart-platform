// File: client/src/components/Navbar.js
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-blue-800 text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Hands2Heart</Link>
        <div className="space-x-4">
          <Link to="/signup" className="hover:underline">Sign Up</Link>
          <Link to="/login" className="hover:underline">Login</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;