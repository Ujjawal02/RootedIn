import React, {useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSignupMutation } from "../../features/auth/authApi";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: {firstname: "", lastname: ""},
    email: "",
    phone: "",
    password: ""
  });

  const navigate = useNavigate();
  const [signup, {isLoading, error}] = useSignupMutation();

  const handleChange = (e) => {
    const {name, value} = e.target;
    if(name === "firstname" || name === "lastname"){
      setFormData({...formData, name: {...formData.name, [name]: value}})
    }else{
      setFormData({...formData, [name]: value})
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(formData).unwrap();
      navigate('/login')
    } catch (error) {
      // error is already captured in the `error` object from the hook — nothing extra needed here
    }
  }
  return(
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-sm p-4">
            <h2 className="text-center mb-4">Create an Account</h2>
            {
              error && (
                <div className="alert alert-danger py-2">
                  {error.data?.message || "Signup failed. Please try again."}
                </div>
              )
            }

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col">
                    <label htmlFor="firstname" className="form-label">First Name</label>
                    <input type="text" name="firstname" id="firstname" className="form-control"
                    value={formData.name.firstname} onChange={handleChange}/>
                </div>

                <div className='col'>
                  <label htmlFor="lastname" className='form-label'>Last Name</label>
                  <input type="text" name="lastname" id="lastname" className='form-control'
                    value={formData.name.lastname} onChange={handleChange} />
                </div>

              <div className="mt-2">
                <label htmlFor="email" className='form-label'>Email</label>
                <input type="email" name="email" id="email" className='form-control'
                  value={formData.email} onChange={handleChange} required />
              </div>

              <div className="mt-2">
                <label htmlFor="phone" className='form-label'>Phone No.</label>
                <input type="tel" name="phone" id="phone" className='form-control'
                  value={formData.phone} onChange={handleChange} required />
              </div>

              <div className="mt-2">
                <label htmlFor="password" className='form-label'>Password</label>
                <input type="password" name="password" id="password" className='form-control'
                  value={formData.password} onChange={handleChange} required />
              </div>
              </div>

              <button className="btn btn-success w-100 mt-4 disabled={isLoading}">
                {isLoading ? "Creating Account..." : "Signup"}
              </button>
              <p className="text-center mt-3 mb-0">
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup