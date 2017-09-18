/*
 * {
    TODO Example interface data
  }
*/

import { ProductLine } from './index';

interface Required {
  productId: number;
}

interface Optional {
    productLine: ProductLine;
}

type Product = Required & Partial<Optional>;

export default Product;
