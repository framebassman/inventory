import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import AddIcon from '@mui/icons-material/Add';
import './ItemInfoMenu.css';
import { allStates, ApplicationState } from './application-state.ts';
import { useLocalStorage } from '@uidotdev/usehooks';

export const ItemInfoMenu = () => {
  const navigate = useNavigate();
  const [applicationState, setApplicationState] = useLocalStorage("ApplicationState", ApplicationState.Assign);
  const [btnValue, setButtonValue] = useState(allStates.findIndex(current => current === applicationState));
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
        label="Выезд"
        icon={<RestoreIcon />}
        onClick={() => setApplicationState(ApplicationState.Arrivals)}
      />
      <BottomNavigationAction
        label="Учёт"
        icon={<AddIcon />}
        onClick={() => setApplicationState(ApplicationState.Assign)}
      />
    </BottomNavigation>
  );
};
