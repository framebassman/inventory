import { verifyType, resetType } from './actions';
import { type TurnstileState } from '../movement/scanner-state';

const initialState: TurnstileState = {
  isTicketFound: false,
  isTicketScanned: false
};

export const reducer = (
  state: TurnstileState = initialState,
  action: any
): TurnstileState => {
  const { type, payload } = action;

  switch (type) {
    case verifyType: {
      const { message } = payload;
      const isTicketFound = message === 'OK';

      if (isTicketFound) {
        const { concertLabel, used } = payload;
        return {
          ...state,
          isTicketScanned: true,
          isTicketFound: true,
          scannedTicket: { concertLabel, used }
        };
      } else {
        return {
          ...state,
          isTicketScanned: true,
          isTicketFound: false,
          scannedTicket: undefined
        };
      }
    }
    case resetType: {
      return {
        ...state,
        isTicketScanned: false,
        isTicketFound: false,
        scannedTicket: undefined
      };
    }
  }

  return state;
};
