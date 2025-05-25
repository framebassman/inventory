export interface ScannedItem {
  concertLabel: string;
  used: boolean;
}

export interface MovementItemState {
  scannedItem?: ScannedItem;
  isItemScanned?: boolean;
  isTicketFound?: boolean;
}
