import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
// import { composeWithDevTools } from 'redux-devtools-extension';

import { movementReducer } from './movement-reducer.ts';
import { assignReducer } from "./assign-reducer.ts";

export class VerificationMethods {
  static Barcode = 'Barcode';
}

const reducers = {
  movement: movementReducer,
  assign: assignReducer
};
const rootReducer = combineReducers({
  ...reducers
});

const middlewareEnhancer = applyMiddleware(thunk);

// const composedEnhancers = composeWithDevTools(middlewareEnhancer);

export const store = createStore(rootReducer, middlewareEnhancer);
