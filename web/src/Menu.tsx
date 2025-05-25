import { useState } from 'react';
import Box from '@mui/material/Box';
import { BottomNavigation, BottomNavigationAction, Container, Grid } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import './Menu.css';

export const Menu = () => {
  const [btnValue, setButtonValue] = useState(0);
  return (
    <>
      <BottomNavigation
        className='bottom_navigation'
        showLabels
        value={btnValue}
        onChange={(_, newValue) => {
          setButtonValue(newValue);
        }}
      >
        <BottomNavigationAction
          label="Выезд"
          value={btnValue}
          icon={<RestoreIcon />}
        />
      </BottomNavigation>
    </>
  )
}
