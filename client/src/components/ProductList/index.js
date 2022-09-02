import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';

import ProductItem from '../ProductItem';
import spinner from '../../assets/spinner.gif';
import { idbPromise } from "../../utils/helpers";
import { QUERY_PRODUCTS } from '../../utils/queries';
import { getCurrentCategory, getProductsList, updateProducts } from '../../utils/productSlice';

function ProductList() {
  const dispatch = useDispatch();
  const currentCategory = useSelector(getCurrentCategory);
  const products = useSelector(getProductsList);

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  useEffect(() => {
    if (data) {
      dispatch(updateProducts(data.products));

      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
    } else if (!loading) {
      idbPromise('products', 'get').then((products) => {
        dispatch(updateProducts(products));
      });
    }
  }, [ data, loading, dispatch ]);

  function filterProducts() {
    if (!currentCategory) {
      return products;
    }

    return products.filter(product => product.category._id === currentCategory);
  }

  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      { products.length ? (
        <div className="flex-row">
          {
            filterProducts().map((product) => (
              <ProductItem key={ product._id } { ...product } />
            ))
          }
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      ) }
      { loading ? <img src={ spinner } alt="loading"/> : null }
    </div>
  );
}

export default ProductList;
