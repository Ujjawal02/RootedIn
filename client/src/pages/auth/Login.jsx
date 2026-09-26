import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useLoginMutation } from '../../features/auth/authApi'

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData).unwrap();
      navigate('/');
    } catch (err) {
      // error object from the hook already covers the UI message below
    }
  };

  return (
    <div className='container mt-5'>
      <div className='row justify-content-center'>
        <div className='col-md-5'>
          <div className="card shadow-sm p-4">
            <h2 className='text-center mb-4'>Login</h2>

            {error && (
              <div className="alert alert-danger py-2">
                {error.data?.message || "Email or password is incorrect."}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <label htmlFor="email" className='form-label'>Email</label>
              <input type="email" name="email" id="email" className='form-control'
                value={formData.email} onChange={handleChange} required />

              <label htmlFor="password" className='form-label mt-2'>Password</label>
              <input type="password" name="password" id="password" className='form-control'
                value={formData.password} onChange={handleChange} required />

              <button className='btn btn-success mt-4 w-100' disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </button>

              <p className="text-center mt-3 mb-0">
                Don't have an account? <Link to="/signup">Signup</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login