import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { extractExistingParams } from '../search-params-parser';

import { Box, Button, CircularProgress, Typography } from '@mui/material';

import './index.css';

const addItemToWarehouseAsync = async (name: string, code: string): Promise<boolean> => {
  await fetch(
    'https://api.inventory.romashov.tech/warehouse/assign',
    {
      method: 'POST',
      mode: "no-cors", // no-cors, *cors, same-origin
      body: JSON.stringify({name, code})
    }
  );
  return true;
}

interface ItemInfo {
  code: string,
  name: string,
  exist: boolean,
}

const fetchItemInfoAsync = async (code: string): Promise<ItemInfo> => {
  // `https://api.inventory.romashov.tech/warehouse/item/${code}`,
  const resp = await fetch(`https://petstore.swagger.io/v2/pet/${code}`);
  try {
    const json = await resp.json();
    return {
      code: code,
      name: json.name,
      exist: true,
    } as ItemInfo;
  } catch {
    return {
      code: code,
      name: '',
      exist: false,
    } as ItemInfo;
  }
}

export const Warehouse = () => {
  const [search] = useSearchParams();
  const [info, setInfo] = useState<ItemInfo | null>(null);
  const [disabled, setDisabled] = useState(false);
  const params = extractExistingParams(search);
  const code = params.item[0];
  useEffect(
    () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      let ignore = false;

      async function startFetchingAsync() {
        const info = await fetchItemInfoAsync(code);
        setInfo(info);
      }

      if (code != '') {
        startFetchingAsync();
      }

      return () => {
        ignore = true;
      };
    },
    []
  );
  
  return (
    <Box>
      { info === null
        ? <CircularProgress color='secondary' />
        : <>
            <Box className="element">
              <Typography textAlign="center">{info?.name}</Typography>
            </Box>
            <Box className="element">
              <Button
                variant='contained'
                onClick={async () => {
                  setDisabled(true);
                  await addItemToWarehouseAsync(String(info?.name), code);
                }}
                disabled={disabled}
              >
                Добавить
              </Button>
            </Box>
          </>
      }
    </Box>
  )
}
