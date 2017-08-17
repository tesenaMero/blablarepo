export interface CatalogEntries {
  entryCode: string;
  entryDesc: string;
  entryId: string;
}

interface Catalog {
  catalogId: number;
  catalogCode: string;
  catalogName: string;
  entries: CatalogEntries[];
}

export interface CatalogById {
  [code: string]: Catalog;
}

export default Catalog;
