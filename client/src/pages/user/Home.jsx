import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetTreesQuery } from '../../features/tree/treeApi';
import { selectCurrentUser } from '../../features/auth/authSlice';
import CartButton from '../../components/cart/CartButton';

const Home = () => {
  const { data: trees, isLoading, isError } = useGetTreesQuery();
  const user = useSelector(selectCurrentUser);

  if (isLoading) {
    return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-success" role="status" /></div>;
  }
  if (isError) return <p className="text-center text-danger py-5">Failed to load trees.</p>;
  if (!trees || trees.length === 0) return <p className="text-center text-muted py-5">No trees available right now.</p>;

  return (
    <div className="row g-4">
      {trees.map((tree) => (
        <div className="col-12 col-sm-6 col-lg-4" key={tree._id}>
          <div className="card h-100 shadow-sm">
            <img src={tree.image.url} alt={tree.name} className="card-img-top" style={{ height: '220px', objectFit: 'cover' }} />
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">{tree.name}</h5>
              <p className="card-text text-muted mb-1">{tree.species}</p>
              <p className="card-text fw-semibold">₹{tree.price}</p>
              <div className="mt-auto d-flex gap-2">
                <Link to={`/trees/${tree._id}`} className="btn btn-outline-success btn-sm flex-grow-1">Details</Link>
                {user?.role === 'user' && <CartButton treeId={tree._id} />}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;