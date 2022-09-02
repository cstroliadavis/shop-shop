import React, { useEffect } from "react";
import { loadStripe } from '@stripe/stripe-js';
import { useLazyQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';

import Auth from '../../utils/auth';
import CartItem from '../CartItem';
import { idbPromise } from "../../utils/helpers";
import { QUERY_CHECKOUT } from '../../utils/queries';
import { addMultipleToCart, checkCartOpen, getCart, toggleCart as toggleCartAction } from '../../utils/productSlice';
import './style.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const Cart = () => {
  const cart = useSelector(getCart);
  const cartOpen = useSelector(checkCartOpen);
  const dispatch = useDispatch();
  const [ getCheckout, { data } ] = useLazyQuery(QUERY_CHECKOUT);

  function toggleCart() {
    dispatch(toggleCartAction());
  }

  function calculateTotal() {
    let sum = cart.reduce((sum, item) => sum + item.price * item.purchaseQuantity, 0);
    return sum.toFixed(2);
  }


  function submitCheckout() {
    const products = cart.reduce((prevIds, item) =>
        [
          ...prevIds,
          ...[ ...Array(item.purchaseQuantity) ].map(() => item._id) ],
      []);

    getCheckout({
      variables: { products },
    });
  }

  useEffect(() => {
    async function getCartFromDb() {
      const dbCart = await idbPromise('cart', 'get');
      dispatch(addMultipleToCart([ ...dbCart ]));
    }

    if (!cart.length) {
      getCartFromDb();
    }
  }, [ cart.length, dispatch ]);

  useEffect(() => {
    if (data) {
      stripePromise.then((res) => {
        res.redirectToCheckout({ sessionId: data.checkout.session });
      });
    }
  }, [ data ]);

  if (!cartOpen) {
    return (
      <div className="cart-closed" onClick={ toggleCart }>
        <span role="img" aria-label="cart">🛒</span>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="close" onClick={ toggleCart }>[close]</div>
      <h2>Shopping Cart</h2>
      { cart.length ? (
        <div>
          { cart.map(item => (
            <CartItem key={ item._id } item={ item }/>
          )) }
          <div className="flex-row space-between">
            <strong>Total: ${ calculateTotal() }</strong>
            {
              Auth.loggedIn() ?
                <button onClick={ submitCheckout }>
                  Checkout
                </button>
                :
                <span>(log in to check out)</span>
            }
          </div>
        </div>
      ) : (
        <h3>
      <span role="img" aria-label="shocked">
        😱
      </span>
          You haven't added anything to your cart yet!
        </h3>
      ) }
    </div>
  );
};

export default Cart;
