// src/components/common/Footer.jsx
import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
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
            <ul className="list-unstyled small">
              <li><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
              <li><Link to="/myTree" className="text-decoration-none text-muted">My Tree</Link></li>
              <li><Link to="/cart" className="text-decoration-none text-muted">Cart</Link></li>
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