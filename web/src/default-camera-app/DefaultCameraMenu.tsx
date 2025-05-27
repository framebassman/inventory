import { useState } from 'react';
import { useLocalStorage } from '@uidotdev/usehooks';
import { useLocation } from 'react-router-dom';

import { allStates, ApplicationState } from './application-state.ts';

import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import RestoreIcon from '@mui/icons-material/Restore';
import AddIcon from '@mui/icons-material/Add';

import './DefaultCameraMenu.css';

export const DefaultCameraMenu = () => {
  const { search } = useLocation();
  const [applicationState, setApplicationState] = useLocalStorage("ApplicationState", ApplicationState.Info);
  const [btnValue, setButtonValue] = useState(
    () => {
      if (search === '') {
        return 0;
      } else {
        return allStates.findIndex(current => current === applicationState);
      }
    }
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
        label="Инфо"
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
        icon={<AddIcon />}
        onClick={() => setApplicationState(ApplicationState.Warehouse)}
      />
    </BottomNavigation>
  );
};
