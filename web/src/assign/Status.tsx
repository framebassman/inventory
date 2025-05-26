import { connect } from 'react-redux';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

import './Status.css';
import { type ScannedItem } from '../scanner-state.ts';
import { Fab } from '@mui/material';

export const Description = ({ message }: { message: string }) => {
  return (
    <span id="status-description" className="description">
      {message}
    </span>
  );
};

export const ItemInfo = ({ label }: { label: string; status?: string }) => {
  return (
    <div id="ticket-info" className="info">
      <span>
        <b>Вещь:</b> {label}
      </span>
    </div>
  );
};

type Props = {
  isTicketFound?: boolean;
  isTicketScanned?: boolean;
  scannedTicket?: ScannedItem;
};

export const Status = ({
  isTicketScanned,
  isTicketFound,
  scannedTicket
}: Props) => {
  if (!isTicketScanned) {
    return (
      <div>
        <Fab size="small">
          <QrCodeScannerIcon />
        </Fab>
        <Description message="Давайте добавим вещь в инвентарь" />
        <ItemInfo label="" />
      </div>
    );
  }

  if (isTicketFound && scannedTicket) {
    const { used, name } = scannedTicket;
    if (!used) {
      return (
        <div>
          <Fab color="primary" size="small">
            <CheckIcon />
          </Fab>
          <Description message="Вещь добавлена в инвентарь" />
          <ItemInfo label={name} />
        </div>
      );
    }

    if (used) {
      return (
        <div>
          <Fab color="secondary" size="small">
            <CancelIcon />
          </Fab>
          <Description message="Вещь уже была просканирована в инвентарь" />
          <ItemInfo label={name} />
        </div>
      );
    }
  }

  return (
    <div>
      <Fab color="secondary" size="small">
        <CancelIcon />
      </Fab>
      <Description message="Вещь не найдена в инвентаре" />
      <ItemInfo label="" />
    </div>
  );
};

export default connect((state: any) => state.assign)(Status);
