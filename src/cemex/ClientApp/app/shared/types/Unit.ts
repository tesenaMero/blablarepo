/*
 * {
    TODO Example interface data
  }
*/

interface Required {
  unitId: number;
}

interface Optional {
  
}

type Unit = Required & Partial<Optional>;

export default Unit;
