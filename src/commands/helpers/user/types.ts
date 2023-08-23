export interface User {
  id: string;
  userName?: string;
  email?: string;
  name?: string;
  address?: string;
  department?: string;
  postalCode?: string;
  company?: string;
  groups?: string[];
  isNew?: boolean;
  createDate?: Date;
  modifiedDate?: Date;
  status?: string;
}
