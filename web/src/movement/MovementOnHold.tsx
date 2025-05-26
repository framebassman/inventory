import { Button, Typography } from '@mui/material';

type Props = {
  onClick: () => any;
};

export const MovementOnHold = ({ onClick }: Props) => {
  return (
    <Button variant="contained" onClick={onClick}>
      <Typography variant="h4">Начать собираться</Typography>
    </Button>
  );
};
