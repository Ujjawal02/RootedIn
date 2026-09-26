import React from 'react'
import { Link, useNavigate, NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useLogoutMutation } from '../../features/auth/authApi'
import { selectCurrentUser } from '../../features/auth/authSlice'

const Navbar = () => {
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate('/login');
    } catch (error) {
      console.log("Logout failed", error);
    }
  };

  const linkClass = ({ isActive }) =>
    `text-decoration-none ${isActive ? "text-success fw-semibold" : "text-dark"}`;

  return (
    <nav className="container-fluid border-bottom py-3 bg-white sticky-top">
      <div className="container d-flex justify-content-between align-items-center flex-wrap gap-2">
        <Link to="/" className="text-decoration-none fs-3 fw-bold text-success">
          🌳 RootedIn
        </Link>

        <div className="flex-grow-1 mx-3" style={{ maxWidth: "400px" }}>
          <input type="text" className="form-control" placeholder="Search trees..." />
        </div>

        <div className="d-flex gap-3 align-items-center">
          <NavLink to="/" className={linkClass}>Home</NavLink>

          {user?.role === "admin" && (
            <>
              <NavLink to="/newTree" className={linkClass}>New Tree</NavLink>
              <NavLink to="/pending" className={linkClass}>Pending Requests</NavLink>
              <NavLink to="/assigned" className={linkClass}>Assigned Trees</NavLink>
              <NavLink to="/deleted" className={linkClass}>Deleted Trees</NavLink>
            </>
          )}

          {user?.role === "user" && (
            <>
              <NavLink to="/cart" className={linkClass}>Cart</NavLink>
              <NavLink to="/myTree" className={linkClass}>My Tree</NavLink>
            </>
          )}

          {user?.role === "farmer" && (
            <NavLink to="/farmer/assigned" className={linkClass}>My Assigned Trees</NavLink>
          )}

          {!user ? (
            <>
              <Link to="/login" className="text-decoration-none">Login</Link>
              <Link to="/signup" className="btn btn-success">Signup</Link>
            </>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted small">Hi, {user?.name?.firstname}</span>
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