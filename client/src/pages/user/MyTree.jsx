import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useGetMyTreeQuery } from '../../features/myTree/myTreeApi'
import { useGetGrowthUpdatesQuery } from '../../features/sponsorship/sponsorshipApi'
import GrowthTimeline from '../../components/tree/GrowthTimeline'

const STATUS_STYLES = {
  pending: "bg-secondary",
  approved: "bg-info",
  assigned: "bg-primary",
  completed: "bg-success",
  rejected: "bg-danger",
};

// Each card is its own component specifically so each one can hold its own
// `expanded` state and its own useGetGrowthUpdatesQuery call, independent of its siblings.
const MyTreeCard = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const { data: updates, isFetching } = useGetGrowthUpdatesQuery(item._id, { skip: !expanded });

  if (!item.treeId) {
    return (
      <div className="col-md-6 col-lg-4">
        <div className="card h-100 shadow-sm">
          <div className="card-body text-muted">Tree information is no longer available.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-md-6 col-lg-4">
      <div className="card h-100 shadow-sm">
        <img src={item.treeId.image?.url} alt={item.treeId.name} className="card-img-top"
          style={{ height: "180px", objectFit: "cover" }} />
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="card-title mb-0">{item.treeId.name}</h5>
            <span className={`badge ${STATUS_STYLES[item.status] || "bg-secondary"}`}>{item.status}</span>
          </div>
          <p className="text-muted mb-1">{item.treeId.species}</p>
          <p className="mb-1"><strong>Amount:</strong> ₹{item.amount}</p>
          <p className="mb-2 text-muted">
            Farmer: {item.farmerId
              ? `${item.farmerId.name?.firstname || ""} ${item.farmerId.name?.lastname || ""}`
              : "Not assigned yet"}
          </p>

          <button onClick={() => setExpanded((e) => !e)} className="btn btn-outline-success btn-sm w-100">
            {expanded ? "Hide Growth Timeline" : "View Growth Timeline"}
          </button>

          {expanded && (
            <div className="mt-3">
              {isFetching ? (
                <div className="d-flex justify-content-center py-2">
                  <div className="spinner-border spinner-border-sm text-success" role="status" />
                </div>
              ) : (
                <GrowthTimeline updates={updates} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MyTree = () => {
  const { data: myTree, isLoading, isError } = useGetMyTreeQuery();

  if (isLoading) {
    return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-success" role="status" /></div>;
  }
  if (isError) {
    return <p className="text-center text-danger py-5">Could not load your sponsored trees.</p>;
  }
  if (!myTree || myTree.length === 0) {
    return (
      <div className="text-center py-5">
        <h4 className="text-muted">You haven't sponsored any trees yet.</h4>
        <Link to="/" className="btn btn-success mt-3">Browse Trees</Link>
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-4">My Sponsored Trees</h3>
      <div className="row g-4">
        {myTree.map((item) => <MyTreeCard key={item._id} item={item} />)}
      </div>
    </div>
  );
};

export default MyTree;