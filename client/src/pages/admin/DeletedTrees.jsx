import React from 'react'
import { useGetDeletedTreesQuery, useRestoreTreeMutation } from '../../features/admin/adminApi'
import PageLoader from '../../components/common/loaders/PageLoader';
import ButtonLoader from '../../components/common/loaders/ButtonLoader';
const DeletedTrees = () => {
  const { data: trees, isLoading, isError } = useGetDeletedTreesQuery();
  const [restoreTree, { isLoading: isRestoring }] = useRestoreTreeMutation();

  if (isLoading) {
    return (
      <PageLoader
        message="Soft Deteting..."
        subMessage="Loading assigned sponsorships..."
      />
    );
  }
  if (isError) {
    return <p className="text-center text-danger py-5">Could not load deleted trees.</p>;
  }
  if (!trees || trees.length === 0) {
    return <p className="text-center text-muted py-5">No deleted trees.</p>;
  }

  return (
    <div>
      <h3 className="mb-4">Deleted Trees</h3>
      <div className="row g-4">
        {trees.map((tree) => (
          <div className="col-md-6 col-lg-4" key={tree._id}>
            <div className="card h-100 shadow-sm opacity-75">
              <img src={tree.image?.url} alt={tree.name} className="card-img-top"
                style={{ height: "180px", objectFit: "cover", filter: "grayscale(40%)" }} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{tree.name}</h5>
                <p className="text-muted mb-1">{tree.species}</p>
                <p className="mb-3">₹{tree.price}</p>
                <button onClick={() => restoreTree(tree._id)} className="btn btn-outline-success mt-auto" disabled={isRestoring}>
                  {isRestoring ? 
                    <ButtonLoader
                      text="Restoring Tree..."
                      light
                    />

                  : "Restore Tree"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeletedTrees;