/*
 * {
    TODO Example interface data
  }
*/

interface ContractProduct {
  contractProductId: number;
  productCode: string;
  productDesc: string;
  productQuantity: number;
  unitOfMeasure: {
    unitId: number;
    unitCode: string;
    unitDesc: string;
  };
  taxPercentage: number;
  productPrice: number;
  proposedPrice: number;
  netAmount: number;
  taxAmount: number;
  totalAmount: number;
};

export default ContractProduct;
