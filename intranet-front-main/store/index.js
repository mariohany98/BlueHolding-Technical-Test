import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { debounce } from "debounce";
import postsReducer from './posts-slice';
import profileReducer from './profile-slice';
import uiReducer from './ui-slice';
import usersReducer from './users-slice';
import { loadState, saveState } from "../libs/browser-storage";
import { getDefaultMiddleware } from "@reduxjs/toolkit";

const store =  configureStore({
    reducer: {
        posts: postsReducer,
        profile: profileReducer,
        ui: uiReducer,
        users: usersReducer
    },
    // here we restore the previously persisted state
    preloadedState: loadState(),
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware({
        serializableCheck: false
      });
    }
})

// here we subscribe to the store changes
  store.subscribe(
    // we use debounce to save the state once each 800ms
    // for better performances in case multiple changes occur in a short time
    debounce(() => {
      saveState(store.getState());
    }, 800)
  );

  // assigning store to next wrapper
const makeStore = () => store;
const storeWrapper = createWrapper(makeStore);

export default storeWrapper;