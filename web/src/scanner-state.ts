export interface ScannedItem {
  name: string;
  used: boolean;
}

export interface AssognItemState {
  scannedItem?: ScannedItem;
  isItemScanned?: boolean;
  isItemFound?: boolean;
}
