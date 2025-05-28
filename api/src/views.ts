export interface MovementItem {
  code: string;
}

export interface MovementStatus {
  hasBeenStarted: boolean;
}

export interface CreateItemRequest {
  code: string;
  name: string;
}
