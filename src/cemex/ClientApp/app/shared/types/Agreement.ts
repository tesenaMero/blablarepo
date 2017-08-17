/*
 * {
    TODO Example interface data
  }
*/

import {
  AgreementItem,
  AgreementStatus,
  CurrencyUnit,
  Jobsite,
  SalesMan,
} from './index';

interface Agreement {
  agreementId: number;
  agreementCode: string;
  agreementStatus: AgreementStatus;
  purchaseOrder: string;
  creationDate: string;
  lastModificationDate: string;
  expirationDate: string;
  startDate: string;
  endDate: string;
  netAmount: number;
  taxAmount: number;
  totalAmount: number;
  remainingTotalAmount: number;
  remainingNetAmount: number;
  VATNumber: string;
  currencyUnit: CurrencyUnit;
  jobsite: Jobsite;
  salesMan: SalesMan;
  agreementItems: AgreementItem[];
}

export default Agreement;
