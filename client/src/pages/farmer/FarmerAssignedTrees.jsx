import React, { useState } from 'react'
import {
  useGetMyAssignedTreesQuery, useMarkCompletedMutation, usePostGrowthUpdateMutation,
} from '../../features/farmer/farmerApi'
import { useGetGrowthUpdatesQuery } from '../../features/sponsorship/sponsorshipApi'
import GrowthTimeline from '../../components/tree/GrowthTimeline'
import ImagePicker from '../../components/common/ImagePicker'

const GrowthUpdateForm = ({ sponsorshipId, onDone }) => {
  const [note, setNote] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [formError, setFormError] = useState("");
  const [postGrowthUpdate, { isLoading }] = usePostGrowthUpdateMutation();

  const handleSubmit = async () => {
    setFormError("");

    if (!imageFile || note.trim().length < 5) {
      setFormError("Add a photo and a note of at least 5 characters.");
      return;
    }

    const body = new FormData();
    body.append("image", imageFile);
    body.append("note", note.trim());

    try {
      await postGrowthUpdate({ sponsorshipId, formData: body }).unwrap();
      onDone();
    } catch (err) {
      console.log("sml", err)
      setFormError(err?.data?.errors?.[0] || err?.data?.message || "Failed to post update.");
    }
  };

  return (
    <div className="border rounded p-2 mb-2">
      <ImagePicker label="Photo" onChange={setImageFile} />
      <textarea
        placeholder="How's the tree doing?"
        className="form-control form-control-sm mb-2"
        rows="2"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      {formError && <div className="text-danger small mb-2">{formError}</div>}
      <button onClick={handleSubmit} className="btn btn-success btn-sm w-100" disabled={isLoading}>
        {isLoading ? "Posting..." : "Submit Update"}
      </button>
    </div>
  );
};

const FarmerTreeCard = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  const { data: updates, isFetching, isError, error } = useGetGrowthUpdatesQuery(item._id, { skip: !expanded });
  const [markCompleted, { isLoading: isCompleting }] = useMarkCompletedMutation();

  const handleComplete = async () => {
    if (!window.confirm("Mark this tree as completed?")) return;
    try {
      await markCompleted(item._id).unwrap();
    } catch (err) {
      alert("Failed to update status.");
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
            <GrowthUpdateForm
              sponsorshipId={item._id}
              onDone={() => { setFormOpen(false); setExpanded(true); }}
            />
          )}

          {expanded && (
            <div className="mb-2">
              {isFetching ? (
                <div className="d-flex justify-content-center py-2">
                  <div className="spinner-border spinner-border-sm text-success" role="status" />
                </div>
              ) : isError ? (
                <p className="text-danger small mb-0">
                  Could not load updates ({error?.status}): {error?.data?.message}
                </p>
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