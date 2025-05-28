import { useLocalStorage } from "@uidotdev/usehooks";
import { Box } from '@mui/material';
import { ApplicationState } from './model';
import { Warehouse } from './warehouse';
import { Movement } from './movement';
import { SessionSettings } from './session-settings';

import './DefaultCameraAppIndex.css';

const getComponent = (applicationState: string) => {
  switch (applicationState) {
    case ApplicationState.Movement:
      return <Movement />;
    case ApplicationState.Warehouse:
      return <Warehouse />;
    default:
      return <SessionSettings />;
  }
}

export const DefaultCameraAppIndex = () => {
  const [applicationState] = useLocalStorage("ApplicationState", ApplicationState.Info);

  return (
    <Box className="parent">
      <Box>
        { getComponent(applicationState) }
      </Box>
    </Box>
  )
}