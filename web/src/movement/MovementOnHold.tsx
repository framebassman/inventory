import { Button, Typography } from '@mui/material';

type Props = {
  onClick: () => any;
};

export const MovementOnHold = ({ onClick }: Props) => {
  // const rubicon = new Date(`2025-05-24T15:00:00.000Z`);
  const rubicon = new Date(
    `${new Date().toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' })}T15:00:00.000Z`
  );
  const now = new Date();
  const text = now < rubicon ? 'Собираемся' : 'Убираемся'
  return (
    <Button variant="contained" onClick={onClick}>
      <Typography variant="h4">{text}</Typography>
    </Button>
  );
};
