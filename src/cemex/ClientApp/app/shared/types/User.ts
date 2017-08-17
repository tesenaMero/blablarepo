import Customer from './Customer';
import Oauth2 from './Oauth2';

interface Profile {
  fullName: string;
}

export interface User {
  country: string;
  customers: Customer[];
  customerId: number;
  edit: string;
  jwt: string;
  oauth2: Oauth2;
  powerUser: string;
  role: string;
  sessionId: number;
  profile: Profile;
}

export default User;
