/*
 * {
    "additionalServiceId": 466,
    "additionalServiceCode": 23,
    "additionalServiceDesc": 7,
  }
*/

interface AdditionalService extends Partial<Optional> {
  additionalServiceId: number;
}

interface Optional {
  additionalServiceCode: string;
  additionalServiceDesc: string;
}

export default AdditionalService;
