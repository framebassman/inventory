export interface Tenant {
  id: string;
  name: string;
  email: number;
  created_at: Date;
}

export interface TenantSecrets {
  id: string;
  tenant_id: string;
  key: string;
  value: string;
}
