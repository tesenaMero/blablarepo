/*
 * {
    TODO Example interface data
  }
*/

interface UnloadType extends Partial<Optional> {
  unloadTypeId: number;
}

interface Optional {
  unloadTypeCode: string;
  unloadTypeDesc: string;
}

export default UnloadType;
