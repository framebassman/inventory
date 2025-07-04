import { Suspense, use } from 'react';
import { useSearchParams } from 'react-router';
import { useLocalStorage } from '@uidotdev/usehooks';
import type { ItemInfo } from '../item-info';
import CheckIcon from '@mui/icons-material/Check';
import { Box, CircularProgress, Fab, Typography } from '@mui/material';

import './index.css';
import { SessionState } from '../model';

let isProcessing = false;

const processItemAsync = async (
  code: string,
  sessionState: string
): Promise<ItemInfo> => {
  try {
    if (isProcessing) {
      return {
        code: code,
        name: '',
        exist: false
      } as ItemInfo;
    }

    let method = '';
    if (sessionState == SessionState.Arrival) {
      method = 'DELETE';
    } else {
      method = 'POST';
    }
    isProcessing = true;
    const resp = await fetch(
      `https://api.inventory.romashov.tech/movement/item`,
      {
        method: method,
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
  } finally {
    isProcessing = true;
  }
};

function ItemInfoEl(props: any) {
  const { hasBeenFetched, sessionState, name } = props;
  if (hasBeenFetched && sessionState === SessionState.Departure) {
    return (
      <>
        <Typography>Взяли на саунд-чек: </Typography>
        <b>
          <span>{name}</span>
        </b>
      </>
    );
  }
  if (hasBeenFetched && sessionState === SessionState.Arrival) {
    return (
      <>
        <Typography>Взяли на базу: </Typography>
        <b>
          <span>{name}</span>
        </b>
      </>
    );
  }
  if (!hasBeenFetched && sessionState === SessionState.Departure) {
    return <Typography>Берём на саунд-чек...</Typography>;
  }
  // !hasBeenFetched && sessionState === SessionState.Arrival
  return <Typography>Берём на базу...</Typography>;
}

function Movement(props: any) {
  const { processItemAsync } = props;
  const info = use<ItemInfo>(processItemAsync);
  const [sessionState] = useLocalStorage(
    'SessionState',
    SessionState.Departure
  );

  return (
    <Box>
      <Box className="element">
        <ItemInfoEl
          hasBeenFetched={info.exist}
          sessionState={sessionState}
          name={info.name}
        />
      </Box>
      <Box className="element">
        {!info.exist ? (
          <CircularProgress color="secondary" />
        ) : (
          <Box className="element">
            <Fab color="secondary">
              <CheckIcon />
            </Fab>
          </Box>
        )}
      </Box>
    </Box>
  );
}

function Index() {
  const [sessionState] = useLocalStorage(
    'SessionState',
    SessionState.Departure
  );
  const [search] = useSearchParams();
  const code = String(search.get('item'));

  if (!search.has('item')) {
    return (
      <Box>
        <Typography>Просканируйте код</Typography>
      </Box>
    );
  }

  return (
    <Suspense
      fallback={
        <Box>
          <Box className="element">
            <CircularProgress color="secondary" />
          </Box>
        </Box>
      }
    >
      <Movement processItemAsync={processItemAsync(code, sessionState)} />
    </Suspense>
  );
}

export default Index;
