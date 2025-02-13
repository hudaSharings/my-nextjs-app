import { Audit } from "./audit";
export interface User extends Audit {
  userName: string;
  name: string;
  email: string;
  mobileNumber: string;
  password: string;
  userType: string;
  employeeId: number;
}


