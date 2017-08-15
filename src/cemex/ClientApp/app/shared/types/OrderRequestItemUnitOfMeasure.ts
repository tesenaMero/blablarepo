interface UnitOfMeasure extends Partial<Optional> {
  unitId: number;
}

interface Optional {
  unitCode: string;
  unitDesc: string;
}

export default UnitOfMeasure;
