/*
 * {
    TODO Example interface data
  }
*/

import {
  AdditionalService,
  DischargeTime,
  LoadSize,
  ProjectElement,
  PumpCapacity,
  Reccurence,
  TimePerLoad,
  TransportMethod,
  UnloadType,
} from './index';

interface Required {
  siteInformation: string;
}

interface Optional {
  loadSize: LoadSize;
  slump: number;
  additionalService: AdditionalService;
  deliveryConfigs: any;
  additionalServices: AdditionalService[];
  element: ProjectElement;
  pumpCapacity: PumpCapacity;
  timePerLoad: TimePerLoad;
  transportMethod: TransportMethod;
  unloadType: UnloadType;
  kicker: boolean;
  dischargeTime: DischargeTime;
  reccurence: Reccurence;
}

type ProjectProperties = Required & Partial<Optional>;

export default ProjectProperties;
