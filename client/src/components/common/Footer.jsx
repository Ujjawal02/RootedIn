
import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../features/auth/authSlice'
import { LINKS_BY_ROLE } from '../../config/navLinks'

const Footer = () => {
  const user = useSelector(selectCurrentUser);
  const roleLinks = LINKS_BY_ROLE[user?.role] || [];

  return (
    <footer className="border-top bg-white mt-auto py-4">
      <div className="container">
        <div className="row gy-3">
          <div className="col-md-4">
            <h5 className="text-success fw-bold">🌳 RootedIn</h5>
            <p className="text-muted small mb-0">
              Sponsor a tree, support a farmer, grow a greener future.
            </p>
          </div>

          <div className="col-md-4">
            <h6 className="fw-semibold">Quick Links</h6>
            <ul className="list-unstyled small mb-0">
              <li><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
              <li><Link to="/about" className="text-decoration-none text-muted">About</Link></li>
              {roleLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-decoration-none text-muted">{link.label}</Link>
                </li>
              ))}
              {!user && (
                <>
                  <li><Link to="/login" className="text-decoration-none text-muted">Login</Link></li>
                  <li><Link to="/signup" className="text-decoration-none text-muted">Signup</Link></li>
                </>
              )}
            </ul>
          </div>

          <div className="col-md-4">
            <h6 className="fw-semibold">Contact</h6>
            <p className="text-muted small mb-0">support@rootedin.example</p>
          </div>
        </div>

        <hr className="my-3" />
        <p className="text-center text-muted small mb-0">
          &copy; {new Date().getFullYear()} RootedIn. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer