import React, {useState, useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {useGetTreeByIdQuery, useUpdateTreeMutation} from '../../features/tree/treeApi'
import ImagePicker from '../../components/common/ImagePicker';

const CATEGORIES = ["Fruit", "Medicinal", "Timber", "Shade", "Flowering"];


const UpdateTree = () => {

  const {id} = useParams();
  const navigate = useNavigate();
  const {data: tree, isLoading: isFetching, isError} = useGetTreeByIdQuery(id);

  const [UpdateTree, {isLoading: isSaving, error}] = useUpdateTreeMutation();

  const [formData, setFormData] = useState({
    name: "", species: "", price: "", category: "", description: "",
  });

  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if(tree){
      setFormData({
        name: tree.name || "",
        species: tree.species || "",
        price: tree.price ?? "",
        category: tree.category || "",
        description: tree.description || "",
      });
    }
  }, [tree]);


  const handleChange = (e) =>{
    setFormData({
      ...formData,
      [e.target.name] : e.target.value
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = new FormData();

    Object.entries(formData).forEach(
      ([key, value])=> body.append(key, value)
    );

    if(imageFile){
      body.append("image", imageFile)
    }

    try {
      await UpdateTree({id, ...formData}).unwrap();
    } catch (error) {
      // the `error` value from the hook drives the message below
    }
  }

  if (isFetching) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-success" role="status" />
      </div>
    );
  }

  if (isError || !tree) {
    return <p className="text-center text-muted py-5">Tree not found.</p>;
  }

  const errorMessage = error?.data?.errors?.[0] || error?.data?.message;

  return (
    <div className='row justify-content-center'>
      <div className='col-md-7'>
          <div className='card shadow-sm p-4'>
                <h2 className='mb-4'>Update Tree</h2>

                {
                  errorMessage && 
                  <div className='alert alert-danger py-2'>
                    {errorMessage}
                  </div>
                }

                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                      <label htmlFor="name" className='form-label'>Name</label>
                      <input type="text" name="name" id="name" className='form-control' 
                      value={formData.name} 
                      onChange={handleChange} required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="species" className="form-label">Species</label>
                      <input type="text" name="species" id="species" className="form-control"
                        value={formData.species} onChange={handleChange} required />
                    </div>

                    <div className='row'>
                        <div className='col mb-3'>
                            <label htmlFor="price" className="form-label">Price (₹)</label>
                            <input type="number" name="price" id="price" min="0" className="form-control"
                              value={formData.price} onChange={handleChange} required />
                        </div>
                        <div className='col mb-3'>
                            <label htmlFor="category" className='form-label'>Category</label>
                            <select name="category" id="category" className='form-select'
                            value={formData.category} onChange={handleChange} required>
                              <option value="" disabled>Select category</option>
                              {CATEGORIES.map((c) => 
                              <option key={c} value={c}>
                                  {c}
                              </option>
                            )}
                            </select>
                        </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">Description</label>
                      <textarea name="description" id="description" className="form-control" rows="3"
                        value={formData.description} onChange={handleChange} required />
                    </div>

                    <ImagePicker label='Tree image (leave empty to keep the current one)'
                    existingUrl={tree.image?.url} onChange={setImageFile}/>
                      
                     <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-success flex-grow-1" disabled={isSaving}>
                          {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                        <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                          Cancel
                        </button>
                      </div> 
                      
                </form>
          </div>
      </div>
    </div>
  )
}

export default UpdateTree