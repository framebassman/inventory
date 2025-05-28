import { useEffect, useState, useActionState } from 'react';

import {
  Box,
  Button,
  CircularProgress,
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

const bakeBunAsync = async () => {
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
  const [_, bakeBunAction, isBaking] = useActionState(bakeBunAsync, false);
  
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
      <div>
      <form
        action={bakeBunAction}
        method='POST'
      >
        <Button
          variant="contained"
          color="secondary"
          type="submit"
          disabled={isBaking || Boolean(hasBeenStarted)}
        >
          {isBaking || hasBeenStarted ? 'Уже собираемся...' : 'Начать собираться'}
        </Button>
      </form>
      </div>
    </Box>
  )
}