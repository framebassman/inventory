import { useLocalStorage } from "@uidotdev/usehooks";
import { Box } from '@mui/material';
import { ApplicationState } from './application-state';
import { Warehouse } from './warehouse';
import { Movement } from './movement';

import './DefaultCameraAppIndex.css';
import { ItemInfo } from "./ItemInfo";

const getComponent = (applicationState: string) => {
  switch (applicationState) {
    case ApplicationState.Movement:
      return <Movement />;
    case ApplicationState.Warehouse:
      return <Warehouse />;
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