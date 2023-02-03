import VuexPersistence from "vuex-persist";

export default ({ store }) => {
  new VuexPersistence({
    key: "e-commerce",
    storage: window.localStorage,
    reducer: state => ({
      alreadyTriedLogin: state.alreadyTriedLogin,
      themeMode: state.themeMode,
      isLoggedIn: state.isLoggedIn
    })
  }).plugin(store);
};
