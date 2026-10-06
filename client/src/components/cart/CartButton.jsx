import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddToCartMutation } from '../../features/cart/cartApi';

const CartButton = ({treeId}) => {
  const navigate = useNavigate();
  const [addToCart, {isLoading}] = useAddToCartMutation();

  const handleClick = async () => {
    try {
      await addToCart(treeId).unwrap();
    } catch (error) {
      navigate('/login')
    }
  }

  return (
    <button
    onClick={handleClick} className='btn btn-primary' disabled={isLoading}>
    {isLoading ? "Adding...": "Add To Cart"}
    </button>
  )
}

export default CartButton;