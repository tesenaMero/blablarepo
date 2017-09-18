/*
 * {
    TODO Example interface data
  }
*/

import { SalesDocumentType, ShipmentLocation } from './index';

interface Required {
  salesDocumentId: number;
}

interface Optional {
    salesDocumentType: SalesDocumentType;
    salesDocumentItemId: number;
    shipmentLocation: ShipmentLocation;  
}

type SalesDocument = Required & Partial<Optional>;

export default SalesDocument;
