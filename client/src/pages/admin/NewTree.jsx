import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateTreeMutation } from '../../features/tree/treeApi'
import ImagePicker from '../../components/common/ImagePicker'
import ButtonLoader from '../../components/common/Loaders/ButtonLoader'
const CATEGORIES = ["Fruit", "Medicinal", "Timber", "Shade", "Flowering"];

const NewTree = () => {
  const [formData, setFormData] = useState({
    name: "", species: "", price: "", category: "", description: "",
  });
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [formError, setFormError] = useState("");
  const [createTree, { isLoading, error }] = useCreateTreeMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if(!imageFile){
      setFormError("Please choose a tree image.");
      return;
    }

    const body = new FormData();
    Object.entries(formData).forEach(
      ([key, value]) => body.append(key, value)
    );
    body.append("image", imageFile);

    try {
      await createTree(body).unwrap();
      navigate('/');
    } catch (err) {
      console.log(err)
      // error object from the hook covers the UI message below
    }
  };

  const errorMessage = formError || error?.data.errors?.[0] | error?.data?.message;
  return (
    <div className="container mt-4 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-7">
          <div className="card shadow-sm p-4">
            <h2 className="mb-4">Add New Tree</h2>

            {errorMessage && (
              <div className="alert alert-danger py-2">
                {errorMessage}
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

              <ImagePicker label="Tree image" required onChange={setImageFile}/>

              <button className="btn btn-success w-100" disabled={isLoading}>
                {isLoading ?
                <ButtonLoader
                  text="Creating New Tree..."
                  light
                />
                : "Add Tree"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewTree