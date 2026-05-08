import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="font-bold text-xl text-purple-600">
            MLBB Marketplace
          </Link>
          <div className="flex gap-4">
            <Link to="/login" className="hover:text-purple-600">Login</Link>
            <Link to="/register" className="hover:text-purple-600">Register</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
