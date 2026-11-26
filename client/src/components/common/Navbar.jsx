import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useLogoutMutation } from '../../features/auth/authApi'
import { selectCurrentUser } from '../../features/auth/authSlice'

import { LINKS_BY_ROLE } from '../../config/navLinks'

const Navbar = () => {
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [logout, { isLoading }] = useLogoutMutation();

  const closeMenu = () => setOpen(false);
  const roleLinks = LINKS_BY_ROLE[user?.role] || [];

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      closeMenu();
      navigate('/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const linkClass = ({ isActive }) =>
    `nav-link ${isActive ? "active fw-semibold text-success" : ""}`;

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold text-success fs-3" onClick={closeMenu}>
          🌳 RootedIn
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`collapse navbar-collapse ${open ? "show" : ""}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink to="/" end className={linkClass} onClick={closeMenu}>Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/about" className={linkClass} onClick={closeMenu}>About</NavLink>
            </li>
            {roleLinks.map((link) => (
              <li className="nav-item" key={link.to}>
                <NavLink to={link.to} className={linkClass} onClick={closeMenu}>{link.label}</NavLink>
              </li>
            ))}
          </ul>

          {!user ? (
            <div className="d-flex gap-2">
              <Link to="/login" className="btn btn-outline-success" onClick={closeMenu}>Login</Link>
              <Link to="/signup" className="btn btn-success" onClick={closeMenu}>Signup</Link>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted small">Hi, {user.name?.firstname}</span>
              <button onClick={handleLogout} className="btn btn-outline-danger btn-sm" disabled={isLoading}>
                {isLoading ? "..." : "Logout"}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar