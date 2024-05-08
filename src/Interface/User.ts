interface User {
  avatar: string;
  email: string;
  firstName: string;
  iban: string | null;
  id: number;
  idNumber: string | null;
  is_suspended: number;
  is_verified: number;
  lastName: string;
  pecEmail: string | null;
  permissions: Permission[];
  phone: string;
  role: Role;
  sdiNumber: string | null;
  supplier: Supplier;
  taxNumber: string | null;
  token: string;
  password: string;
  confirmPassword: string;
  location: Location;
}

interface Location {
  address: string;
  city: string;
  province: string;
  country: string;
  zipcode: string;
}

interface Permission {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
}
  
interface Supplier {
  categoryId: number | null;
  categoryName: string | null;
  description: string | null;
  id: number | null;
  name: string | null;
}

export default User;