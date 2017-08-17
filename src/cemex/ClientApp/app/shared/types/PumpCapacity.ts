/*
 * {
    TODO Example interface data
  }
*/

interface PumpCapacity extends Partial<Optional> {
  pumpCapacityId: number;
}

interface Optional {
  pumpCapacityCode: string;
  pumpCapacityDesc: string;
}

export default PumpCapacity;
