export default {
  user: state => {
    return state.user;
  },
  getCartLength: state => state.cart.length,
  isLoadingUser: state => state.isLoadingUser,
  attemptedLogin: state => state.attemptedLogin
};
