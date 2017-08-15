/*
 * {
    TODO Example interface data
  }
*/

import { Project } from './index';

interface Customer {
  customerId: number;
  customerDesc: string;
  customerCode: string;
}

interface ProjectProfile {
  profileId: number;
  profileName: string;
  project: Project;
  customer: Customer;
}

export default ProjectProfile;
