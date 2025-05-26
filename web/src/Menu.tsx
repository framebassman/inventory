import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import AddIcon from '@mui/icons-material/Add';
import './Menu.css';

export const Menu = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const paths = ['/', '/assign'];
  const [btnValue, setButtonValue] = useState(paths.findIndex(current => current === pathname));
  return (
    <>
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
          onClick={() => navigate('/')}
        />
        <BottomNavigationAction
          label="Учёт"
          icon={<AddIcon />}
          onClick={() => navigate('/assign')}
        />
      </BottomNavigation>
    </>
  );
};
