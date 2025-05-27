import { useLocalStorage } from "@uidotdev/usehooks";
import { Box } from '@mui/material';
import { ApplicationState } from './application-state';
import { Assign } from './assign';
import { Movement } from './movement';

import './ItemInfo.css';

export const ItemInfo = () => {
  const [applicationState] = useLocalStorage("ApplicationState", ApplicationState.Assign);

  return (
    <Box className="parent">
      <Box>
        { applicationState == ApplicationState.Assign
          ? <Assign />
          : <Movement />
        }
      </Box>
    </Box>
  )
}