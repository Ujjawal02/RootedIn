import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const SponsorButton = ({treeId}) => {
    // const {treeId} = useParams();
    const navigate = useNavigate();

  return (
    <button
    onClick={() => navigate(`/sponsor?type=direct&treeId=${treeId}`)}
    className='btn btn-warning'
    >Proceed to Sponsor</button>
  )
}

export default SponsorButton