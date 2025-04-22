// src/components/Navbar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-brand">Library Management System</div>
        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              📖 Books
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/users" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              🧑‍🎓 Users
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/loans" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              🔄 Loans
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;