import React from 'react'
import {useParams, Link, useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux'
import {useGetTreeByIdQuery, useDeleteTreeMutation} from '../../features/tree/treeApi'
import {selectCurrentUser} from '../../features/auth/authSlice'
import CartButton from '../../components/cart/CartButton'
import SponsorButton from '../../components/tree/SponsorButton'

const ShowTree = () => {
  const {id} = useParams();
  const naviagate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const {data:tree, isLoading, isError} = useGetTreeByIdQuery(id);
  const [deleteTree, {isLoading: isDeleting}] = useDeleteTreeMutation(id);

  const handleDelete = async () => {
    if(!window.confirm("Delete this tree? This can be restored later from Deleted Trees.")){
      return;
    }
    try {
      await deleteTree(id).unwrap();
      Navigate('/');
    } catch (error) {
      alert("Something went wrong deleting this tree.");
    }
  }

  if (isLoading) {
    return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-success" role="status" /></div>;
  }
  if (isError || !tree) {
    return <p className="text-center text-muted py-5">Tree not found.</p>;
  }

  return (
    <div className="row">
      <div className="col-md-6">
        <img src={tree.image.url} alt={tree.name} className="img-fluid rounded shadow-sm" />
      </div>
      <div className="col-md-6">
        <h1>{tree.name}</h1>
        <p className="text-muted mb-1"><strong>Species:</strong> {tree.species}</p>
        <p className="mb-1"><strong>Category:</strong> {tree.category}</p>
        <p className="fs-4 fw-semibold text-success"><strong>₹{tree.price}</strong></p>
        <p>{tree.description}</p>

        {user?.role === "user" && (
          <div className="d-flex gap-2 mt-3">
            <CartButton treeId={tree._id} />
            <SponsorButton treeId={tree._id} />
          </div>
        )}

        {user?.role === "admin" && (
          <div className="d-flex gap-2 mt-3">
            <button onClick={handleDelete} className="btn btn-danger" disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
            <Link to={`/trees/update/${tree._id}`}>
              <button className="btn btn-warning">Update</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShowTree