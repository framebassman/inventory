import { Box, Button, Typography } from '@mui/material';
import './MovementOnHold.css';

type Props = {
  onClick: () => any;
};

export const MovementOnHold = ({ onClick }: Props) => {
  return (
    <Box className="button_wrapper" alignItems="center" justifyContent="center">
      <Button className="start_button" variant="contained" onClick={onClick}>
        <Typography variant="h4" id="start_scan">
          Начать сканировать
        </Typography>
      </Button>
    </Box>
  );
};
