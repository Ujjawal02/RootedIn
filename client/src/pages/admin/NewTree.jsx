import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateTreeMutation } from '../../features/tree/treeApi'

const CATEGORIES = ["Fruit", "Medicinal", "Timber", "Shade", "Flowering"];

const NewTree = () => {
  const [formData, setFormData] = useState({
    name: "", species: "", price: "", category: "", description: "", imageUrl: "",
  });
  const navigate = useNavigate();
  const [createTree, { isLoading, error }] = useCreateTreeMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTree(formData).unwrap();
      navigate('/');
    } catch (err) {
      // error object from the hook covers the UI message below
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-7">
          <div className="card shadow-sm p-4">
            <h2 className="mb-4">Add New Tree</h2>

            {error && (
              <div className="alert alert-danger py-2">
                {error.data?.message || "Failed to create tree."}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input type="text" name="name" id="name" className="form-control"
                  value={formData.name} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label htmlFor="species" className="form-label">Species</label>
                <input type="text" name="species" id="species" className="form-control"
                  value={formData.species} onChange={handleChange} required />
              </div>

              <div className="row">
                <div className="col mb-3">
                  <label htmlFor="price" className="form-label">Price (₹)</label>
                  <input type="number" name="price" id="price" min="0" className="form-control"
                    value={formData.price} onChange={handleChange} required />
                </div>
                <div className="col mb-3">
                  <label htmlFor="category" className="form-label">Category</label>
                  <select name="category" id="category" className="form-select"
                    value={formData.category} onChange={handleChange} required>
                    <option value="" disabled>Select category</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea name="description" id="description" className="form-control" rows="3"
                  value={formData.description} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label htmlFor="imageUrl" className="form-label">Image URL</label>
                <input type="url" name="imageUrl" id="imageUrl" className="form-control"
                  placeholder="https://..." value={formData.imageUrl} onChange={handleChange} required />
                {formData.imageUrl && (
                  <img src={formData.imageUrl} alt="Preview" className="img-thumbnail mt-2"
                    style={{ maxHeight: "180px" }} onError={(e) => { e.target.style.display = "none"; }} />
                )}
              </div>

              <button className="btn btn-success w-100" disabled={isLoading}>
                {isLoading ? "Creating..." : "Add Tree"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewTree