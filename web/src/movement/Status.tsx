import { connect } from 'react-redux';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

import './Status.css';
import { type ScannedItem } from './scanner-state';
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
        <Description message="Готов сканировать вещь!" />
        <ItemInfo label="" />
      </div>
    );
  }

  if (isTicketFound && scannedTicket) {
    const { used, concertLabel } = scannedTicket;
    if (!used) {
      return (
        <div>
          <Fab color="primary" size="small">
            <CheckIcon />
          </Fab>
          <Description message="Вещь записана" />
          <ItemInfo label={concertLabel} />
        </div>
      );
    }

    if (used) {
      return (
        <div>
          <Fab color="secondary" size="small">
            <CancelIcon />
          </Fab>
          <Description message="Вещь уже была просканирована на этот выезд" />
          <ItemInfo label={concertLabel} />
        </div>
      );
    }
  }

  return (
    <div>
      <Fab color="secondary" size="small">
        <CancelIcon />
      </Fab>
      <Description message="Вещь не найдена" />
      <ItemInfo label="" />
    </div>
  );
};

export default connect((state: any) => state.turnstile)(Status);
