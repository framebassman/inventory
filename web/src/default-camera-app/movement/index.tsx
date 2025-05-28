import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import CheckIcon from '@mui/icons-material/Check';

import {
  Box,
  Button,
  CircularProgress,
  Fab,
  TextField,
  Typography
} from '@mui/material';

import './index.css';
import type { ItemInfo } from '../item-info';

const addItemToMovementAsync = async (code: string): Promise<ItemInfo> => {
  try {
    const resp = await fetch(
      `https://api.inventory.romashov.tech/movement/item`,
      {
        method: "POST",
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

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    let ignore = false;

    async function startFetchingAsync() {
      setSubmitting(true);
      const info = await addItemToMovementAsync(code);
      setInfo(info);
      setSubmitting(false);
    }

    if (code != '') {
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
          <Typography>Добавляем...</Typography>
        </Box>
        <Box className="element">
          <CircularProgress/>
        </Box>
      </Box>
    )
  }

  return (
    <Box>
      <Box className="element">
        <Typography>
          <span>Добавили </span>
          <span>{info?.name}</span>
        </Typography>
      </Box>
      <Box className="element">
        <Fab color="secondary"><CheckIcon/></Fab>
      </Box>
    </Box>
  )
}
