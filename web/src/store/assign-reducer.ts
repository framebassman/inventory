import { verifyType, resetType } from './actions';
import { type AssignItemState } from '../scanner-state.ts';

const initialState: AssignItemState = {
  isItemFound: false,
  isItemScanned: false
};

export const assignReducer = (
  state: AssignItemState = initialState,
  action: any
): AssignItemState => {
  const { type, payload } = action;

  switch (type) {
    case verifyType: {
      const { message } = payload;
      const isItemFound = message === 'OK';

      if (isItemFound) {
        const { concertLabel, used } = payload;
        return {
          ...state,
          isItemScanned: true,
          isItemFound: true,
          scannedItem: { name: concertLabel, used }
        };
      } else {
        return {
          ...state,
          isItemScanned: true,
          isItemFound: false,
          scannedItem: undefined
        };
      }
    }
    case resetType: {
      return {
        ...state,
        isItemScanned: false,
        isItemFound: false,
        scannedItem: undefined
      };
    }
  }

  return state;
};
