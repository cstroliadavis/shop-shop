import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

import { idbPromise, pluralize } from "../../utils/helpers";
import { addToCart as addToCartAction, getCart, updateCartQuantity } from '../../utils/productSlice';

function ProductItem(item) {
  const {
    image,
    name,
    _id,
    price,
    quantity,
  } = item;
  const dispatch = useDispatch();
  const cart = useSelector(getCart);

  const addToCart = () => {
    const itemInCart = cart.find((cartItem) => cartItem._id === _id);

    if (itemInCart) {
      const purchaseQuantity = parseInt(itemInCart.purchaseQuantity) + 1;

      dispatch(updateCartQuantity({ _id, purchaseQuantity }));
      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity,
      });
    } else {
      const payload = { ...item, purchaseQuantity: 1 };
      dispatch(addToCartAction(payload));
      idbPromise('cart', 'put', payload);
    }
  };

  return (
    <div className="card px-1 py-1">
      <Link to={ `/products/${ _id }` }>
        <img
          alt={ name }
          src={ `/images/${ image }` }
        />
        <p>{ name }</p>
      </Link>
      <div>
        <div>{ quantity } { pluralize("item", quantity) } in stock</div>
        <span>${ price }</span>
      </div>
      <button onClick={ addToCart }>Add to cart</button>
    </div>
  );
}

export default ProductItem;
