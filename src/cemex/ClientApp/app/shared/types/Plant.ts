/*
 * {
    TODO Example interface data
  }
*/

interface Required {
  plantId: number;
  plantCode: string;
}

interface Optional {
    plantDesc: string;
    telephone: string;
    contactPhone: string;
}

export type Plant = Required & Partial<Optional>;

export default Plant;
