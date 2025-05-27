import { InventoryManagementStore } from '../src/model/inventory-management-store';
import { GoogleServiceAccountCredentials } from '../src/model/google-objects';

export class MockStore extends InventoryManagementStore {
  constructor() {
    super(
      {
        client_email: 'test@test.test',
        private_key: 'key'
      } as GoogleServiceAccountCredentials,
      ''
    );
  }
}
