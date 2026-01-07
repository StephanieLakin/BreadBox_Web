export interface Client {
  id: number;
  name: string;
  emailAddress: string;
  phone: string;
  address: string;
  createdAt: string; // ISO string from DateTime
  userId: number;
}