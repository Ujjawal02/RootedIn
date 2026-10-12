import React, { useState } from 'react'
import {
  useGetMyAssignedTreesQuery, useMarkCompletedMutation, usePostGrowthUpdateMutation,
} from '../../features/farmer/farmerApi'
import { useGetGrowthUpdatesQuery } from '../../features/sponsorship/sponsorshipApi'
import GrowthTimeline from '../../components/tree/GrowthTimeline'

// Same per-item sub-component pattern as MyTreeCard — each card needs its own
// expand/collapse state, its own form state, and its own independent hook calls.
const FarmerTreeCard = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({ imageUrl: "", note: "" });

  const { data: updates, isFetching } = useGetGrowthUpdatesQuery(item._id, { skip: !expanded });
  const [markCompleted, { isLoading: isCompleting }] = useMarkCompletedMutation();
  const [postGrowthUpdate, { isLoading: isPosting }] = usePostGrowthUpdateMutation();

  const handleComplete = async () => {
    if (!window.confirm("Mark this tree as completed?")) return;
    try {
      await markCompleted(item._id).unwrap();
    } catch (error) {
      alert("Failed to update status.");
    }
  };

  const handlePostUpdate = async () => {
    if (!formData.imageUrl || !formData.note) {
      alert("Please add both a photo URL and a note.");
      return;
    }
    try {
      await postGrowthUpdate({ sponsorshipId: item._id, ...formData }).unwrap();
      setFormData({ imageUrl: "", note: "" });
      setFormOpen(false);
      setExpanded(true);
    } catch (error) {
      console.log(error)
      alert("Failed to post update.");
    }
  };

  return (
    <div className="col-md-6 col-lg-4">
      <div className="card h-100 shadow-sm">
        <img src={item.treeId?.image?.url} alt={item.treeId?.name} className="card-img-top"
          style={{ height: "180px", objectFit: "cover" }} />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{item.treeId?.name}</h5>
          <p className="text-muted mb-1">{item.treeId?.species}</p>
          <p className="mb-1">
            Sponsor: {item.sponsorId?.name?.firstname} {item.sponsorId?.name?.lastname}
          </p>
          <span className="badge bg-primary mb-3 align-self-start">{item.status}</span>

          <div className="d-flex gap-2 mb-2">
            <button onClick={() => setFormOpen((o) => !o)} className="btn btn-outline-success btn-sm flex-grow-1">
              {formOpen ? "Cancel" : "Post Update"}
            </button>
            <button onClick={() => setExpanded((e) => !e)} className="btn btn-outline-secondary btn-sm flex-grow-1">
              {expanded ? "Hide History" : "View History"}
            </button>
          </div>

          {formOpen && (
            <div className="border rounded p-2 mb-2">
              <input type="url" placeholder="Photo URL" className="form-control form-control-sm mb-2"
                value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} />
              <textarea placeholder="How's the tree doing?" className="form-control form-control-sm mb-2" rows="2"
                value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} />
              <button onClick={handlePostUpdate} className="btn btn-success btn-sm w-100" disabled={isPosting}>
                {isPosting ? "Posting..." : "Submit Update"}
              </button>
            </div>
          )}

          {expanded && (
            <div className="mb-2">
              {isFetching ? (
                <div className="d-flex justify-content-center py-2">
                  <div className="spinner-border spinner-border-sm text-success" role="status" />
                </div>
              ) : (
                <GrowthTimeline updates={updates} />
              )}
            </div>
          )}

          <button onClick={handleComplete} className="btn btn-success mt-auto" disabled={isCompleting}>
            {isCompleting ? "Updating..." : "Mark as Completed"}
          </button>
        </div>
      </div>
    </div>
  );
};

const FarmerAssignedTrees = () => {
  const { data: trees, isLoading, isError } = useGetMyAssignedTreesQuery();

  if (isLoading) {
    return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-success" role="status" /></div>;
  }
  if (isError) {
    return <p className="text-center text-danger py-5">Could not load your assigned trees.</p>;
  }
  if (!trees || trees.length === 0) {
    return <p className="text-center text-muted py-5">No trees assigned to you right now.</p>;
  }

  return (
    <div>
      <h3 className="mb-4">My Assigned Trees</h3>
      <div className="row g-4">
        {trees.map((item) => <FarmerTreeCard key={item._id} item={item} />)}
      </div>
    </div>
  );
};

export default FarmerAssignedTrees;