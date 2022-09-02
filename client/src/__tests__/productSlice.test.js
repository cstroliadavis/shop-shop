import productReducer, {
  addMultipleToCart,
  addToCart,
  clearCart,
  removeFromCart,
  toggleCart,
  updateCartQuantity,
  updateCategories,
  updateCurrentCategory,
  updateProducts,
} from '../utils/productSlice';

// create a sample of what our global state will look like
const initialState = Object.freeze({
  products: Object.freeze([]),
  categories: Object.freeze([ Object.freeze({ name: 'Food' }) ]),
  currentCategory: '1',

  cart: Object.freeze([
    Object.freeze({
      _id: '1',
      name: 'Soup',
      purchaseQuantity: 1,
    }),
    Object.freeze({
      _id: '2',
      name: 'Bread',
      purchaseQuantity: 2,
    }),
  ]),
  cartOpen: false,
});

test('updateProducts', () => {
  let newState = productReducer(initialState, updateProducts([ {}, {} ]));

  expect(newState.products.length).toBe(2);
  expect(initialState.products.length).toBe(0);
});

test('updateCategories', () => {
  let newState = productReducer(initialState, updateCategories([ {}, {} ]));

  expect(newState.categories.length).toBe(2);
  expect(initialState.categories.length).toBe(1);
});

test('updateCurrentQuanity', () => {
  let newState = productReducer(initialState, updateCurrentCategory('2'));

  expect(newState.currentCategory).toBe('2');
  expect(initialState.currentCategory).toBe('1');
});

test('addToCart', () => {
  let newState = productReducer(initialState, addToCart({ purchaseQuantity: 1 }));

  expect(newState.cart.length).toBe(3);
  expect(initialState.cart.length).toBe(2);
});

test('addMultipleToCart', () => {
  let newState = productReducer(initialState, addMultipleToCart([ {}, {} ]));

  expect(newState.cart.length).toBe(4);
  expect(initialState.cart.length).toBe(2);
});

test('removeFromCart', () => {
  let newState1 = productReducer(initialState, removeFromCart('1'));

  // cart is still open
  expect(newState1.cartOpen).toBe(true);

  // the second item should now be the first
  expect(newState1.cart.length).toBe(1);
  expect(newState1.cart[0]._id).toBe('2');

  let newState2 = productReducer(newState1, removeFromCart('2'));

  // cart is empty and closed
  expect(newState2.cartOpen).toBe(false);
  expect(newState2.cart.length).toBe(0);

  expect(initialState.cart.length).toBe(2);
});

test('updateCartQuantity', () => {
  let newState = productReducer(initialState, updateCartQuantity({
    _id: '1',
    purchaseQuantity: 3,
  }));

  expect(newState.cartOpen).toBe(true);
  expect(newState.cart[0].purchaseQuantity).toBe(3);
  expect(newState.cart[1].purchaseQuantity).toBe(2);

  expect(initialState.cartOpen).toBe(false);
  expect(initialState.cart[0].purchaseQuantity).toBe(1);
});

test('clearCart', () => {
  let newState = productReducer(initialState, clearCart());

  expect(newState.cartOpen).toBe(false);
  expect(newState.cart.length).toBe(0);
  expect(initialState.cart.length).toBe(2);
});

test('toggleCart', () => {
  let newState = productReducer(initialState, toggleCart());

  expect(newState.cartOpen).toBe(true);
  expect(initialState.cartOpen).toBe(false);

  let newState2 = productReducer(newState, toggleCart());

  expect(newState2.cartOpen).toBe(false);
});
