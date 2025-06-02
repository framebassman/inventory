export class ApplicationState {
  static Info = "Info"
  static Movement = "Movement"
  static Warehouse = "Warehouse"
}

export const allApplicationStates = [
  ApplicationState.Info,
  ApplicationState.Movement,
  ApplicationState.Warehouse
]

export class SessionState {
  static Departure = "Departure"
  static Arrival = "Arrival"
}

export const allSessionStates = [
  SessionState.Departure,
  SessionState.Arrival,
]