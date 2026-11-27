import React from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  useDirectCheckoutQuery, useCartItemCheckoutQuery, useCartCheckoutQuery,
  useConfirmSponsorshipMutation,
} from '../../features/sponsorship/sponsorshipApi'
import PageLoader from '../../components/common/loaders/PageLoader';
import toast from 'react-hot-toast';
import ButtonLoader from '../../components/common/Loaders/ButtonLoader';


const Sponsor = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');
  const treeId = searchParams.get('treeId');
  const cartId = searchParams.get('cartId');

  // All three hooks run every render — `skip` just stops the ones that don't apply
  // from firing a request at all, based on which `type` is actually in the URL.
  const direct = useDirectCheckoutQuery(treeId, { skip: type !== 'direct' });
  const cartItem = useCartItemCheckoutQuery(cartId, { skip: type !== 'cart-item' });
  const cartAll = useCartCheckoutQuery(undefined, { skip: type !== 'cart-all' });

  const [confirmSponsorship, { isLoading: isConfirming }] = useConfirmSponsorshipMutation();

  const active = type === 'direct' ? direct : type === 'cart-item' ? cartItem : cartAll;
  const { data: checkout, isLoading, isError } = active;

  const items = type === 'cart-all' ? checkout?.items : [checkout?.item];
  const total = type === 'cart-all' ? checkout?.totalAmount : checkout?.item?.total;

  const handleConfirm = async () => {
      try {
        let body;
        if (type === 'direct') {
          body = {
            type,
            treeId
          };
        } else if (type === 'cart-item') {
          body = {
            type,
            cartId
          };
        } else if (type === 'cart-all') {
          body = {
            type
          };
        }
      await confirmSponsorship(body).unwrap();
      toast.success("Sponsorship request submitted. Our team will review it and assign a farmer soon.");
      navigate('/myTree');
    } catch (error) {
      console.log("CONFIRM ERROR:", error);
      toast.error(error?.data?.message || "Could not confirm your sponsorship. Please try again.");
    }
  };

  if (!type) {
    return <p className="text-center text-danger py-5">Invalid checkout link.</p>;
  }
  if (isLoading) {
    return (
      <PageLoader
        message="Loading Sponsorship page"
        subMessage="Loading assigned sponsorships..."
      />
    );
  }
  if (isError || !checkout) {
    return <p className="text-center text-danger py-5">Could not load checkout details. Please try again.</p>;
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-7">
        <div className="card shadow-sm p-4">
          <h3 className="mb-4">Order Summary</h3>

          {items?.map((item) => (
            <div key={item.treeId} className="d-flex justify-content-between align-items-center py-2 border-bottom">
              <div>
                <h6 className="mb-0">{item.name}</h6>
                <small className="text-muted">Quantity: {item.quantity}</small>
              </div>
              <span className="fw-semibold">₹{item.price}</span>
            </div>
          ))}

          <div className="d-flex justify-content-between align-items-center mt-3">
            <h5 className="mb-0">Total</h5>
            <h5 className="mb-0 text-success">₹{total}</h5>
          </div>

          <button onClick={handleConfirm} className="btn btn-success w-100 mt-4" disabled={isConfirming}>
            {isConfirming ? 
            <ButtonLoader
              text="Posting Update..."
              light
            />
            : "Confirm Sponsorship"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sponsor