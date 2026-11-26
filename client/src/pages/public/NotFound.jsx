import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => (
  <div className="text-center py-5">
    <h1 className="display-4 text-success">404</h1>
    <p className="lead text-muted">We couldn't find that page.</p>
    <Link to="/" className="btn btn-success">Back to home</Link>
  </div>
)

export default NotFound