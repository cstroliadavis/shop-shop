import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useSelector, useDispatch } from 'react-redux';

import Cart from '../components/Cart';
import spinner from '../assets/spinner.gif';
import { idbPromise } from "../utils/helpers";
import { QUERY_PRODUCTS } from '../utils/queries';
import {
  addToCart as addToCartAction,
  getCart,
  getProductsList,
  removeFromCart as removeFromCartAction,
  updateCartQuantity, updateProducts,
} from '../utils/productSlice';


function Detail() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [ currentProduct, setCurrentProduct ] = useState({});
  const { loading, data } = useQuery(QUERY_PRODUCTS);
  const products = useSelector(getProductsList);
  const cart = useSelector(getCart);

  const addToCart = () => {
    const itemInCart = cart.find((cartItem) => cartItem._id === id);

    if (itemInCart) {
      const purchaseQuantity = parseInt(itemInCart.purchaseQuantity) + 1;
      dispatch(updateCartQuantity({_id: id, purchaseQuantity }));
      // if we're updating quantity, use existing item data and increment purchaseQuantity value by one
      idbPromise('cart', 'put', { ...itemInCart, purchaseQuantity });
    } else {
      const payload = { ...currentProduct, purchaseQuantity: 1 };
      dispatch(addToCartAction(payload));
      // if product isn't in the cart yet, add it to the current shopping cart in IndexedDB
      idbPromise('cart', 'put', payload);
    }
  };

  const removeFromCart = () => {
    dispatch(removeFromCartAction(currentProduct._id));

    // upon removal from cart, delete the item from IndexedDB using the `currentProduct._id` to locate what to remove
    idbPromise('cart', 'delete', { ...currentProduct });
  };

  useEffect(() => {
    // already in global store
    if (products.length) {
      setCurrentProduct(products.find(product => product._id === id));
    }
    // retrieved from server
    else if (data) {
      dispatch(updateProducts(data.products));

      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
    }
    // get cache from idb
    else if (!loading) {
      idbPromise('products', 'get').then((indexedProducts) => {
        dispatch(updateProducts(indexedProducts));
      });
    }
  }, [ products, data, loading, dispatch, id ]);

  return (
    <>
      { currentProduct ? (
        <div className="container my-1">
          <Link to="/">← Back to Products</Link>

          <h2>{ currentProduct.name }</h2>

          <p>{ currentProduct.description }</p>

          <p>
            <strong>Price:</strong>${ currentProduct.price }{ ' ' }
            <button onClick={ addToCart }>Add to Cart</button>
            <button
              disabled={ !cart.find(p => p._id === currentProduct._id) }
              onClick={ removeFromCart }
            >
              Remove from Cart
            </button>
          </p>

          <img
            src={ `/images/${ currentProduct.image }` }
            alt={ currentProduct.name }
          />
        </div>
      ) : null }
      { loading ? <img src={ spinner } alt="loading"/> : null }
      <Cart/>
    </>
  );
}

export default Detail;
