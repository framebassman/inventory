export class ErrorCauses {
  public static NOT_FOUND: string = 'Inventory: Item not found';
}

export class ItemNotFoundError extends Error {
  constructor(message: string) {
    super(message); // (1)
    this.name = ErrorCauses.NOT_FOUND; // (2)
  }
}
