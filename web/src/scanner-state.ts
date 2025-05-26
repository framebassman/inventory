export interface ScannedItem {
  name: string;
  used: boolean;
}

export interface AssignItemState {
  scannedItem?: ScannedItem;
  isItemScanned?: boolean;
  isItemFound?: boolean;
}
