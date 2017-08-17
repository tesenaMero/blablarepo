/*
 * {
    TODO Example interface data
  }
*/

interface TimePerLoad extends Partial<Optional> {
  timePerLoadId: number;
}

interface Optional {
  timePerLoadCode: string;
  timePerLoadDesc: string;
}

export default TimePerLoad;
