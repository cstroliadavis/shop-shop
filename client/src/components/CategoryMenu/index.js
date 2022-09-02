import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';

import { idbPromise } from '../../utils/helpers';
import { QUERY_CATEGORIES } from '../../utils/queries';
import { getCategoriesList, updateCategories, updateCurrentCategory } from '../../utils/productSlice';

function CategoryMenu() {
  const dispatch = useDispatch();
  const categories = useSelector(getCategoriesList);

  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);

  useEffect(() => {
    if (categoryData) {
      dispatch(updateCategories(categoryData.categories));
      categoryData.categories.forEach(category => {
        idbPromise('categories', 'put', category);
      });
    } else if (!loading) {
      idbPromise('categories', 'get').then(items => {
        dispatch(updateCategories(items));
      });
    }
  }, [ categoryData, loading, dispatch ]);

  const handleClick = id => () => dispatch(updateCurrentCategory(id));

  return (
    <div>
      <h2>Choose a Category:</h2>
      { categories.map(item => (
        <button
          key={ item._id }
          onClick={ handleClick(item._id) }
        >
          { item.name }
        </button>
      )) }
    </div>
  );
}

export default CategoryMenu;
