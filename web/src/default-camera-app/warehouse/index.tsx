import { useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
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

interface ItemInfo {
  code: string;
  name: string;
  exist: boolean;
}

const fetchItemInfoAsync = async (code: string): Promise<ItemInfo> => {
  const resp = await fetch(
    `https://api.inventory.romashov.tech/warehouse/item/${code}`
  );
  try {
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

async function addItemToWarehouseAsync(formData: FormData) {
  const code = formData.get('code');
  const name = formData.get('name');
  await fetch('https://api.inventory.romashov.tech/warehouse/assign', {
    method: 'POST',
    mode: 'no-cors', // no-cors, *cors, same-origin
    body: JSON.stringify({ name, code })
  });
}

export const Warehouse = () => {
  const [search] = useSearchParams();
  const [info, setInfo] = useState<ItemInfo | null>(null);
  const code = String(search.get('item'));
  const { pending } = useFormStatus();
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    let ignore = false;

    async function startFetchingAsync() {
      try {
        const info = await fetchItemInfoAsync(code);
        setInfo(info);
      } catch {
        console.log('erorr from server');
        setInfo({ code: code, name: '', exist: false } as ItemInfo);
      }
    }

    if (code != '') {
      startFetchingAsync();
    }

    return () => {
      ignore = true;
    };
  }, []);

  if (!search.has('item')) {
    return (
      <Box>
        <Typography>Просканируйте код</Typography>
      </Box>
    );
  }

  if (info === null) {
    return (
      <Box>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (info.exist === false) {
    return (
      <Box>
        <form action={addItemToWarehouseAsync} method="POST">
          <Box className="element">
            <TextField
              name="name"
              variant="outlined"
              placeholder="Введите название..."
              required
              onInvalid={(e) =>
                (e.target as HTMLInputElement).setCustomValidity(
                  'Введите название'
                )
              }
            />
            <input hidden name="code" value={code} />
          </Box>
          <Box className="element">
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              disabled={pending}
            >
              {pending ? 'Добавляем...' : 'Добавить'}
            </Button>
          </Box>
        </form>
      </Box>
    );
  }

  return (
    <Box>
      <Box className="element">
        <Typography textAlign="center">
          Успешно добавили <b>{info.name}</b>
        </Typography>
      </Box>
      <Box className="element">
        <Fab color="success">
          <CheckIcon />
        </Fab>
      </Box>
    </Box>
  );
};
