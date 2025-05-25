export interface ScannedTicket {
  concertLabel: string;
  used: boolean;
}

export interface TurnstileState {
  scannedTicket?: ScannedTicket;
  isTicketScanned?: boolean;
  isTicketFound?: boolean;
}
