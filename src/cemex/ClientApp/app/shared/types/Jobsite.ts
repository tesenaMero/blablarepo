/*
 * {
    TODO Example interface data
  }
*/

import {
  Address,
  BusinessLine,
  JobsiteContact,
  PointOfDelivery,
  Segmentation,
} from './index';

interface Jobsite extends Partial<Optional> {
  jobsiteId: number;
  jobsiteCode: string;
  jobsiteRelated: string;
  jobsiteDesc: string;
  address: Address;
  segmentation: Segmentation[];
  businessLines: BusinessLine[];
}

interface Optional {
  pointOfDeliveries: PointOfDelivery[];
  contacts: JobsiteContact;
}

export default Jobsite;
