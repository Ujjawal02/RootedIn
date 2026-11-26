import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../features/auth/authSlice'

const STEPS = [
  { title: "Choose a tree", text: "Browse the catalogue and pick the tree you want to sponsor." },
  { title: "A farmer is assigned", text: "Our team reviews your request and assigns a farmer who plants and looks after the tree." },
  { title: "Watch it grow", text: "The farmer posts dated photo updates, and you can follow them any time from My Tree." },
];

const About = () => {
  const user = useSelector(selectCurrentUser);

  return (
    <div>
      <section className="text-center py-4 mb-4">
        <h1 className="fw-bold text-success">Sponsor a tree. Support a farmer.</h1>
        <p className="lead text-muted mx-auto" style={{ maxWidth: "640px" }}>
          RootedIn connects people who want to grow trees with farmers who plant and care for them,
          and keeps a photo record of every tree's growth.
        </p>
        {user ? (
          <Link to="/" className="btn btn-success">Browse trees</Link>
        ) : (
          <div className="d-flex justify-content-center gap-2">
            <Link to="/signup" className="btn btn-success">Create an account</Link>
            <Link to="/" className="btn btn-outline-success">Browse trees</Link>
          </div>
        )}
      </section>

      <section>
        <h2 className="h4 text-center mb-4">How it works</h2>
        <div className="row g-4">
          {STEPS.map((step, index) => (
            <div className="col-md-4" key={step.title}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <span className="badge bg-success mb-2">Step {index + 1}</span>
                  <h3 className="h5">{step.title}</h3>
                  <p className="text-muted mb-0">{step.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;