import { Customer } from './Customer';
import User from './User';

export interface Auth {
  isLoading: boolean;
  isLoadingCustomers: boolean;
  fetchingCustomersError: boolean;
  error: boolean;
  user?: User;
  customer?: Customer;
  customers?: Customer[];
  customerId?: string;
}

export default Auth;
