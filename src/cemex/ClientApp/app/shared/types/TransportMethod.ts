/*
 * {
    TODO Example interface data
  }
*/

interface TransportMethod extends Partial<Optional> {
  transportMethodId: number;

}

interface Optional {
  transportMethodCode: string;
  transportMethodDesc: string;
}

export default TransportMethod;
