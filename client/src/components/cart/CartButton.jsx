import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddToCartMutation } from '../../features/cart/cartApi';

const CartButton = ({treeId}) => {
  const navigate = useNavigate();
  const [addToCart, {isLoading}] = useAddToCartMutation();

  const handleClick = async () => {
  try {
    await addToCart(treeId).unwrap();
    toast.success("Added to cart");
  } catch (error) {
    if (error?.status === 401) {
      toast.error("Please log in to add trees to your cart.");
      navigate('/login');
    } else {
      toast.error(error?.data?.message || "Could not add to cart.");
    }
  }
};

  return (
    <button
    onClick={handleClick} className='btn btn-primary' disabled={isLoading}>
    {isLoading ? "Adding...": "Add To Cart"}
    </button>
  )
}

export default CartButton;