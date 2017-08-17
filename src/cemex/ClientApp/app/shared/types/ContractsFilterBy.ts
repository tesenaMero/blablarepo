/*
 * {
    TODO Example interface data
  }
*/

import {
  ProductDescTypes,
} from './index';

interface ContractsFilterBy {
  date: {
    from?: Date;
    to?: Date;
  };
  productType: ProductDescTypes | null;
  jobSite: string | null;
}

export default ContractsFilterBy;
