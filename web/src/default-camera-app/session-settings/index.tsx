import { useEffect, useState, useActionState } from 'react';

import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Stack,
  Switch,
  Typography,
} from '@mui/material';

import './index.css';

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
    { method: "POST" }
  );
  try {
    const json = await resp.json();
    return json.hasBeenStarted;
  } catch {
    return false;
  }
};

export const SessionSettings = () => {
  const [hasBeenStarted, setHasBeenStarted] = useState<boolean | null>(null);
  const [_, movementStatusFetchAction, isFetchingMovementStatus] = useActionState(movementStatusAsync, false);
  
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    let ignore = false;

    async function startFetchingAsync() {
      const info = await fetchSessionInfoAsync();
      setHasBeenStarted(info);
    }

    if (!ignore) {
      startFetchingAsync();
    }

    return () => {
      ignore = true;
    };
  }, [hasBeenStarted]);
  
  if (hasBeenStarted === null) {
    return (
      <Box>
        <CircularProgress color="secondary" />
      </Box>
    )
  }

  return (
    <Box>
      <Box className="element">
        <Stack direction="row" component="label" alignItems="center" justifyContent="center">
          <Typography>На саунд-чек</Typography>
          <Switch color="secondary" />
          <Typography>На базу</Typography>
        </Stack>
      </Box>
      <Box className="element">
        <form
          action={movementStatusFetchAction}
          method='POST'
        >
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            disabled={isFetchingMovementStatus || Boolean(hasBeenStarted)}
          >
          {isFetchingMovementStatus || hasBeenStarted ? 'Уже собираемся...' : 'Начать собираться'}
          </Button>
        </form>
      </Box>
    </Box>
  )
}