/*
 * {
    TODO Example interface data
  }
*/

interface Required {
  productLineId: number;
}

interface Optional {
  
}

type ProductLine = Required & Partial<Optional>;

export default ProductLine;
