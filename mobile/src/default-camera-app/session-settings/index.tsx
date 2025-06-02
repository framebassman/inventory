import { useActionState, Suspense, use } from 'react';
import { useLocalStorage } from '@uidotdev/usehooks';

import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Switch,
  Typography
} from '@mui/material';

import './index.css';
import { SessionState } from '../model';

const fetchSessionInfoAsync = async (): Promise<boolean> => {
  const resp = await fetch(
    `https://api.inventory.romashov.tech/movement/current`
  );
  try {
    const json = await resp.json();
    return json.hasBeenStarted;
  } catch {
    return false;
  }
};

const movementStatusAsync = async () => {
  const resp = await fetch(
    `https://api.inventory.romashov.tech/movement/current`,
    { method: 'POST' }
  );
  try {
    const json = await resp.json();
    return json.hasBeenStarted;
  } catch {
    return false;
  }
};

function SessionSettings(props: any) {
  const { fetchHasBeenStartedAsync } = props;
  const hasBeenStarted = use<boolean>(fetchHasBeenStartedAsync);
  const [_, movementStatusFetchAction, isFetchingMovementStatus] =
    useActionState(movementStatusAsync, false);
  const [sessionState, setSessionState] = useLocalStorage(
    'SessionState',
    SessionState.Departure
  );

  return (
    <Box>
      <Box className="element">
        <Stack
          direction="row"
          component="label"
          alignItems="center"
          justifyContent="center"
        >
          <Typography>На саунд-чек</Typography>
          <Switch
            color="secondary"
            onChange={() => {
              if (sessionState === SessionState.Departure) {
                setSessionState(SessionState.Arrival);
              } else {
                setSessionState(SessionState.Departure);
              }
            }}
            checked={sessionState === SessionState.Arrival}
          />
          <Typography>На базу</Typography>
        </Stack>
      </Box>
      <Box className="element">
        <form action={movementStatusFetchAction} method="POST">
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            disabled={isFetchingMovementStatus || hasBeenStarted}
          >
            {isFetchingMovementStatus || hasBeenStarted
              ? 'Уже собираемся...'
              : 'Начать собираться'}
          </Button>
        </form>
      </Box>
    </Box>
  );
}

function Index() {
  return (
    <Suspense
      fallback={
        <Box>
          <CircularProgress color="secondary" />
        </Box>
      }
    >
      <SessionSettings fetchHasBeenStartedAsync={fetchSessionInfoAsync()} />
    </Suspense>
  );
}

export default Index;
