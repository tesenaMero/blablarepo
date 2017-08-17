interface LoadSize extends Partial<Optional> {
  loadSizeId: number;
}

interface Optional {
  loadSizeCode: string;
  loadSizeDesc: string;
}

export default LoadSize;
