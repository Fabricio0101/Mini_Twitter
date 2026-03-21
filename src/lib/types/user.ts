export interface User {
  id: number;
  name: string;
  email: string;
  bio?: string | null;
  location?: string | null;
  avatarUrl?: string | null;
  createdAt?: string | null;
  phone?: string | null;
  address?: string | null;
  state?: string | null;
  zipCode?: string | null;
  maritalStatus?: string | null;
}
