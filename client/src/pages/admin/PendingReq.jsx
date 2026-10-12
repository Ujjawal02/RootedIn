import React from 'react'
import { useApproveRequestMutation, useGetPendingRequestsQuery, useRejectRequestMutation } from '../../features/admin/adminApi'

const PendingReq = () => {
  const {data: requests, isLoading, isError} = useGetPendingRequestsQuery();
  const [approveRequest, {isLoading: isApproving}] = useApproveRequestMutation();
  const [rejectRequest, {isLoading: isRejecting}] = useRejectRequestMutation();

  if(isLoading){
    return 
    <div className='d-flex justify-content-center py-5'>
      <div className='spinner-border text-success' role="status"/>
    </div>
  }
  
  if (isError) {
    return <p className="text-center text-danger py-5">Could not load pending requests.</p>;
  }

  if (!requests || requests.length === 0) {
    return <p className="text-center text-muted py-5">No pending requests right now.</p>;
  }


  return (
    <div>
      <h3 className='mb-4'>Pending Sponsorship Requests</h3>
      {requests.map((req) => (
        <div key={req._id} className='card mb-3 shadow-sm'>
          <div className='row g-0 align-items-center'>
            <div className='col-2'>
              <img src={req.treeId?.image?.url} alt={req.treeId?.name} className="img-fluid rounded-start"
              style={{ height: "90px", width: "100%", objectFit: "cover" }}/>
            </div>
            <div className="col-7">
              <div className="card-body py-2">
                <h5 className="mb-1">{req.treeId?.name}</h5>
                <p className="mb-1 text-muted">Amount: ₹{req.amount}</p>
                <p className="mb-0 small">
                  Requested by: {req.sponsorId?.name?.firstname} {req.sponsorId?.name?.lastname} ({req.sponsorId?.email})
                </p>
              </div>
            </div>

            <div className="col-3 d-flex gap-2 justify-content-end pe-3">
              <button onClick={() => approveRequest(req._id)} className="btn btn-success btn-sm" disabled={isApproving || isRejecting}>
                Approve
              </button>
              <button onClick={() => rejectRequest(req._id)} className="btn btn-outline-danger btn-sm" disabled={isApproving || isRejecting}>
                Reject
              </button>
            </div>
            
          </div>
        </div>
      ))}
    </div>
  )
}

export default PendingReq