/*
 * {
    TODO Example interface data
  }
*/

interface Required {
  productColorId: number;
}

interface Optional {
    productColorCode: string;
    productColorDesc: string;
    id: number;
    name: string;
}

export type ProductColor = Required & Partial<Optional>;

export default ProductColor;
