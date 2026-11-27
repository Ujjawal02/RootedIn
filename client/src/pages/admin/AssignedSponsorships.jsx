import React, { useState } from 'react'
import {
  useGetApprovedUnassignedQuery, useGetFarmersQuery, useAssignFarmerMutation,
} from '../../features/admin/adminApi'
import toast from 'react-hot-toast';
import PageLoader from '../../components/common/loaders/PageLoader';
import ButtonLoader from '../../components/common/Loaders/ButtonLoader';
const AssignedSponsorships = () => {
  const { data: requests, isLoading, isError } = useGetApprovedUnassignedQuery();
  const { data: farmers } = useGetFarmersQuery();
  console.log("<<<<<>>>>>>")
  console.log(farmers);
  const [assignFarmer, { isLoading: isAssigning }] = useAssignFarmerMutation();
  const [selectedFarmer, setSelectedFarmer] = useState({});

  const handleAssign = async (sponsorshipId) => {
    const farmerId = selectedFarmer[sponsorshipId];
    if (!farmerId) {
      toast.error("Please select a farmer first.");
      return;
    }
    try {
      await assignFarmer({ sponsorshipId, farmerId }).unwrap();
      toast.success("Farmer assigned.");
    } catch (error) {
      toast.error("Failed to assign farmer.");
    }
  };

  if (isLoading) {
    return (
      <PageLoader
        message="Growing your impact"
        subMessage="Loading assigned sponsorships..."
      />
    );
  }
  if (isError) {
    return <p className="text-center text-danger py-5">Could not load approved requests.</p>;
  }
  if (!requests || requests.length === 0) {
    return <p className="text-center text-muted py-5">No approved requests waiting for farmer assignment.</p>;
  }

  return (
    <div>
      <h3 className="mb-4">Assign Farmers</h3>
      {requests.map((req) => (
        <div key={req._id} className="card mb-3 shadow-sm">
          <div className="row g-0 align-items-center">
            <div className="col-2">
              <img src={req.treeId?.image?.url} alt={req.treeId?.name} className="img-fluid rounded-start"
                style={{ height: "90px", width: "100%", objectFit: "cover" }} />
            </div>
            <div className="col-5">
              <div className="card-body py-2">
                <h5 className="mb-1">{req.treeId?.name}</h5>
                <p className="mb-1 text-muted">Amount: ₹{req.amount}</p>
                <p className="mb-0 small">
                  Sponsor: {req.sponsorId?.name?.firstname} {req.sponsorId?.name?.lastname}
                </p>
              </div>
            </div>
            <div className="col-3">
              <select className="form-select form-select-sm"
                value={selectedFarmer[req._id] || ""}
                onChange={(e) => setSelectedFarmer((prev) => ({ ...prev, [req._id]: e.target.value }))}>
                <option value="" disabled>Select farmer</option>
                {farmers?.map((f) => (
                  <option key={f._id} value={f._id}>{f.name?.firstname} {f.name?.lastname} ({f.email})</option>
                ))}
              </select>
            </div>
            <div className="col-2 d-flex justify-content-end pe-3">
              <button onClick={() => handleAssign(req._id)} className="btn btn-success btn-sm" disabled={isAssigning}>
                {isAssigning ? 
                 <ButtonLoader
                  text="Assigning to Farmer..."
                  light
                />
                : "Assign"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AssignedSponsorships;