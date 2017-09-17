/*
 * {
    TODO Example interface data
  }
*/

import { SalesDocument, Unit, Product } from './index';

interface Required {
  product: Product;
}

interface Optional {
  commercialDesc: string;
  commercialCode: string;
  unitOfMeasure: Unit;
  salesDocument: SalesDocument;  
}

type ProductWrapper = Required & Partial<Optional>;

export default ProductWrapper;
