export interface ScannedItem {
  name: string;
  used: boolean;
}

export interface MovementItemState {
  scannedItem?: ScannedItem;
  isItemScanned?: boolean;
  isItemFound?: boolean;
}
