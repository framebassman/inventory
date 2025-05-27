import { useLocalStorage } from "@uidotdev/usehooks";
import { Box } from '@mui/material';
import { ApplicationState } from './application-state';
import { Assign } from './assign';
import { Movement } from './movement';

import './DefaultCameraAppIndex.css';
import { ItemInfo } from "./ItemInfo";

const getComponent = (applicationState: string) => {
  switch (applicationState) {
    case ApplicationState.Movement:
      return <Movement />;
    case ApplicationState.Warehouse:
      return <Assign />;
    default:
      return <ItemInfo />;
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