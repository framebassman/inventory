import { useState } from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import AddIcon from '@mui/icons-material/Add';
import './Menu.css';
import { useNavigate } from 'react-router-dom';

export const Menu = () => {
  const [btnValue, setButtonValue] = useState(0);
  const navigate = useNavigate();
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
