import React from "react";
import { Link, useLocation } from "react-router-dom";
import './index.css';

const Header = () => {
  const location = useLocation();

  const getNavLinkClass = (path) => {
    return location.pathname === path
      ? "text-orange-500 font-medium"
      : "text-gray-600 hover:text-gray-900";
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="w-8 h-8 bg-red-500 rounded-full" />
        <div className="flex space-x-8">
          <Link to="/" className={getNavLinkClass("/")}>
            Home
          </Link>
          <Link to="/upload" className={getNavLinkClass("/upload")}>
            Upload Notes
          </Link>
          <Link to="/browse" className={getNavLinkClass("/browse")}>
            Browse Notes
          </Link>
          <Link to="/login" className={getNavLinkClass("/login")}>
            Login</Link>
          <Link to="/about" className={getNavLinkClass("/about")}>
            About Us
          </Link>
          
        </div>
        <div className="w-8 h-8 bg-blue-500 rounded-full" />
      </div>
    </nav>
  );
};

export default Header;