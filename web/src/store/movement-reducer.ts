import { verifyType, resetType } from './actions';
import { type MovementItemState } from '../movement/scanner-state';

const initialState: MovementItemState = {
  isItemFound: false,
  isItemScanned: false
};

export const movementReducer = (
  state: MovementItemState = initialState,
  action: any
): MovementItemState => {
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
