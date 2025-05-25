import { verifyType, resetType } from './actions';
import { type MovementItemState } from '../movement/scanner-state';

const initialState: MovementItemState = {
  isTicketFound: false,
  isItemScanned: false
};

export const reducer = (
  state: MovementItemState = initialState,
  action: any
): MovementItemState => {
  const { type, payload } = action;

  switch (type) {
    case verifyType: {
      const { message } = payload;
      const isTicketFound = message === 'OK';

      if (isTicketFound) {
        const { concertLabel, used } = payload;
        return {
          ...state,
          isItemScanned: true,
          isTicketFound: true,
          scannedItem: { concertLabel, used }
        };
      } else {
        return {
          ...state,
          isItemScanned: true,
          isTicketFound: false,
          scannedItem: undefined
        };
      }
    }
    case resetType: {
      return {
        ...state,
        isItemScanned: false,
        isTicketFound: false,
        scannedItem: undefined
      };
    }
  }

  return state;
};
