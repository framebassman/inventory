import { Button, Typography } from '@mui/material';
import Container from '@mui/material/Container';
import './MovementOnHold.css';

type Props = {
  onClick: () => any
}

export const MovementOnHold = ({ onClick }: Props) => {
  return (
    <Container>
      <Button variant="contained" onClick={onClick}>
        <Typography variant="h4" id="start_scan">Начать сканировать</Typography>
      </Button>
    </Container>
  )
};
