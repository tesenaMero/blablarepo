/*
 * {
    TODO Example interface data
  }
*/

interface AgreementItem {
  materialId: number;
  agreementItemId: number;
  materialCode: string;
  materialTypeCode: string;
  materialDescription: string;
  materialTypeDesc: string;
  materialUnit: {
    unitId: number;
    unitCode: string;
    unitDesc: string
  };
  taxPercentage: number;
  basePrice: number;
  proposedPrice: number;
  proposedPriceTax: number;
  proposedPriceTotal: number;
  quantity: number;
  remainingQuantity: number;
  netAmount: number;
  taxAmmount: number;
  remainingNetAmount: number;
}

export default AgreementItem;
