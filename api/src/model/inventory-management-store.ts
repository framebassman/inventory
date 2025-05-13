import { injectable } from 'tsyringe';
import { google, sheets_v4 } from 'googleapis';
import type { GoogleServiceAccountCredentials } from './google-objects';

@injectable()
export class InventoryManagementStore {
  private sheetsClient: sheets_v4.Sheets;
  private databaseId: string;
  privage credentials: GoogleServiceAccountCredentials;

  constructor(
    credentials: GoogleServiceAccountCredentials,
    databaseId: string
  ) {
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    this.sheetsClient = google.sheets({ version: 'v4', auth });
    this.databaseId = databaseId;
    this.credentials = credentials;
  }

  public async saveDataAsync() {
    console.log('credentials:');
    console.log(this.credentials);
    const exampleData = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        phone: '+1234567890',
        plan: 'Gold Plan',
        premium_amount: 50000,
        start_policy_date: '2025-01-01',
        end_policy_date: '2026-01-01'
      }
    ];
    const values = exampleData.map((item) => [
      item.firstName,
      item.lastName,
      item.email,
      item.phone,
      item.plan,
      item.premium_amount,
      item.start_policy_date,
      item.end_policy_date
    ]);

    await this.sheetsClient.spreadsheets.values.append({
      spreadsheetId: this.databaseId,
      range: 'Sheet1!A2', // Adjust based on your sheet structure
      valueInputOption: 'RAW',
      requestBody: { values }
    });
  }
}
