/*
 * {
    TODO Example interface data
  }
*/
import { ProjectProperties } from './index';
import UnitOfMeasure from './OrderRequestItemUnitOfMeasure';

interface OrderRequestItemProduct extends Partial<Optional> {
  productId: number;
  productCode: string;
  unitOfMeasure: UnitOfMeasure;
}

interface Optional {
  productDesc: string;
  productQuantity: number;
  productPrice: number;
  productProfile: ProjectProperties;
}

export default OrderRequestItemProduct;
