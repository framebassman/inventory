import { useLocalStorage } from "@uidotdev/usehooks";
import { Box } from '@mui/material';
import { ApplicationState } from './application-state';
import { Assign } from './assign';
import { Movement } from './movement';

import './DefaultCameraAppIndex.css';

export const DefaultCameraAppIndex = () => {
  const [applicationState] = useLocalStorage("ApplicationState", ApplicationState.Info);

  return (
    <Box className="parent">
      <Box>
        { applicationState == ApplicationState.Warehouse
          ? <Assign />
          : <Movement />
        }
      </Box>
    </Box>
  )
}