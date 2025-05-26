import { verifyType, resetType } from './actions';
import { type AssognItemState } from '../scanner-state.ts';

const initialState: AssognItemState = {
  isItemFound: false,
  isItemScanned: false
};

export const assignReducer = (
  state: AssognItemState = initialState,
  action: any
): AssognItemState => {
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
