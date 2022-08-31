import React, { useEffect } from "react";
import { loadStripe } from '@stripe/stripe-js';
import { useLazyQuery } from '@apollo/client';

import Auth from '../../utils/auth';
import CartItem from '../CartItem';
import { idbPromise } from "../../utils/helpers";
import { QUERY_CHECKOUT } from '../../utils/queries';
import { ADD_MULTIPLE_TO_CART, TOGGLE_CART } from "../../utils/actions";
import { useStoreContext } from '../../utils/GlobalState';
import './style.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const Cart = () => {
  const [ state, dispatch ] = useStoreContext();
  const [ getCheckout, { data } ] = useLazyQuery(QUERY_CHECKOUT);

  function toggleCart() {
    dispatch({ type: TOGGLE_CART });
  }

  function calculateTotal() {
    let sum = state.cart.reduce((sum, item) => sum + item.price * item.purchaseQuantity, 0);
    return sum.toFixed(2);
  }


  function submitCheckout() {
    const products = state.cart.reduce((prevIds, item) =>
        [
          ...prevIds,
          ...[ ...Array(item.purchaseQuantity) ].map(() => item._id) ],
      []);

    getCheckout({
      variables: { products },
    });
  }

  useEffect(() => {
    async function getCart() {
      const cart = await idbPromise('cart', 'get');
      dispatch({ type: ADD_MULTIPLE_TO_CART, products: [ ...cart ] });
    }

    if (!state.cart.length) {
      getCart();
    }
  }, [ state.cart.length, dispatch ]);

  useEffect(() => {
    if (data) {
      stripePromise.then((res) => {
        res.redirectToCheckout({ sessionId: data.checkout.session });
      });
    }
  }, [ data ]);

  if (!state.cartOpen) {
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
      { state.cart.length ? (
        <div>
          { state.cart.map(item => (
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
