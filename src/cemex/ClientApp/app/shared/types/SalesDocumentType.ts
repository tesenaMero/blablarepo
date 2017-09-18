/*
 * {
    TODO Example interface data
  }
*/

interface Required {
  salesDocumentTypeId: number;
}

interface Optional {
  
}

type SalesDocumentType = Required & Partial<Optional>;

export default SalesDocumentType;
