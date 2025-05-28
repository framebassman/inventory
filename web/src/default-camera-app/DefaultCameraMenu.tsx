import { useState } from 'react';
import { useLocalStorage } from '@uidotdev/usehooks';

import { allStates, ApplicationState } from './application-state.ts';

import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import RestoreIcon from '@mui/icons-material/Restore';
import AddHomeIcon from '@mui/icons-material/AddHome';

import './DefaultCameraMenu.css';

export const DefaultCameraMenu = () => {
  const [applicationState, setApplicationState] = useLocalStorage(
    'ApplicationState',
    ApplicationState.Info
  );
  const [btnValue, setButtonValue] = useState(() =>
    allStates.findIndex((current) => current === applicationState)
  );
  return (
    <BottomNavigation
      className="bottom_navigation"
      showLabels
      value={btnValue}
      onChange={(_, newValue) => {
        setButtonValue(newValue);
      }}
    >
      <BottomNavigationAction
        label="Настройки"
        icon={<BubbleChartIcon />}
        onClick={() => setApplicationState(ApplicationState.Info)}
      />
      <BottomNavigationAction
        label="Выезд"
        icon={<RestoreIcon />}
        onClick={() => setApplicationState(ApplicationState.Movement)}
      />
      <BottomNavigationAction
        label="Учёт"
        icon={<AddHomeIcon />}
        onClick={() => setApplicationState(ApplicationState.Warehouse)}
      />
    </BottomNavigation>
  );
};
