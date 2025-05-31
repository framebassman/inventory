import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useLocalStorage } from '@uidotdev/usehooks';
import type { ItemInfo } from '../item-info';
import CheckIcon from '@mui/icons-material/Check';
import { Box, CircularProgress, Fab, Typography } from '@mui/material';

import './index.css';
import { SessionState } from '../model';

const addItemToDeparturesAsync = async (code: string): Promise<ItemInfo> => {
  try {
    const resp = await fetch(
      `https://api.inventory.romashov.tech/movement/item`,
      {
        method: 'POST',
        body: JSON.stringify({ code: code })
      }
    );
    const json = await resp.json();
    return {
      code: code,
      name: json.name,
      exist: resp.ok
    } as ItemInfo;
  } catch {
    return {
      code: code,
      name: '',
      exist: false
    } as ItemInfo;
  }
};

const addItemToArrivalsAsync = async (code: string): Promise<ItemInfo> => {
  try {
    const resp = await fetch(
      `https://api.inventory.romashov.tech/movement/item`,
      {
        method: 'DELETE',
        body: JSON.stringify({ code: code })
      }
    );
    const json = await resp.json();
    return {
      code: code,
      name: json.name,
      exist: resp.ok
    } as ItemInfo;
  } catch {
    return {
      code: code,
      name: '',
      exist: false
    } as ItemInfo;
  }
};

export const Movement = () => {
  const [search] = useSearchParams();
  const [info, setInfo] = useState<ItemInfo | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const code = String(search.get('item'));
  const [sessionState] = useLocalStorage(
    'SessionState',
    SessionState.Departure
  );

  useEffect(() => {
    let ignore = false;

    async function startFetchingAsync() {
      setSubmitting(true);
      if (sessionState == SessionState.Arrival) {
        const info = await addItemToArrivalsAsync(code);
        setInfo(info);
        setSubmitting(false);
      } else {
        const info = await addItemToDeparturesAsync(code);
        setInfo(info);
        setSubmitting(false);
      }
    }

    if (!ignore || code != '') {
      startFetchingAsync();
    }

    return () => {
      ignore = true;
    };
  }, [code]);

  if (!search.has('item')) {
    return (
      <Box>
        <Typography>Просканируйте код</Typography>
      </Box>
    );
  }

  if (submitting) {
    return (
      <Box>
        <Box className="element">
          {sessionState === SessionState.Departure ? (
            <Typography>Берём на саунд-чек...</Typography>
          ) : (
            <Typography>Берём на базу...</Typography>
          )}
        </Box>
        <Box className="element">
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Box className="element">
        <Typography>
          {sessionState === SessionState.Departure ? (
            <span>Взяли на саунд-чек </span>
          ) : (
            <span>Взяли на базу </span>
          )}
          <span>{info?.name}</span>
        </Typography>
      </Box>
      <Box className="element">
        <Fab color="secondary">
          <CheckIcon />
        </Fab>
      </Box>
    </Box>
  );
};
