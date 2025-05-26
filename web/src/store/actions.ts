import { verifyUrl } from './urls/prod';
import { cooldown } from './timeouts';

export const waitingType = 'TURNSTILE_WAITING';
export const verifyType = 'TURNSTILE_VERIFY';
export const resetType = 'TURNSTILE_RESET';

async function transfersFromBackAsync(barcode: string, method: string) {
  try {
    const result = await fetch(verifyUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { Authorization: 'Bearer pkR9vfZ9QdER53mf' },
      body: JSON.stringify({ code: barcode, method })
    });
    return result;
  } catch (e: any) {
    console.log(e.response);
    return e.response;
  }
}

export type MovementActions = {
  verify: (barcode: string, method: string) => any;
};

export const movementActionCreators: MovementActions = {
  verify: (barcode: string, method: string) => async (dispatch: any) => {
    dispatch({ type: waitingType });

    const { data } = await transfersFromBackAsync(barcode, method);

    dispatch({
      type: verifyType,
      payload: data
    });
    setTimeout(() => {
      dispatch({ type: resetType });
    }, cooldown);
  }
};

export type AssignActions = {
  verify: (barcode: string, method: string) => any;
};

export const assignActionCreators: AssignActions = {
  verify: (barcode: string, method: string) => async (dispatch: any) => {
    dispatch({ type: waitingType });

    const { data } = await transfersFromBackAsync(barcode, method);

    dispatch({
      type: verifyType,
      payload: data
    });
    setTimeout(() => {
      dispatch({ type: resetType });
    }, cooldown);
  }
};
