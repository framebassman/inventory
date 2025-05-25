export class VerificationMethods {
  static Barcode = 'Barcode';
}

import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { thunk } from 'redux-thunk';
// import { composeWithDevTools } from 'redux-devtools-extension';

import { reducer as turnstileReducer } from './reducer';

const reducers = {
  turnstile: turnstileReducer
};
const rootReducer = combineReducers({
  ...reducers
});

const middlewareEnhancer = applyMiddleware(thunk);

// const composedEnhancers = composeWithDevTools(middlewareEnhancer);

export const store = createStore(rootReducer, middlewareEnhancer);
