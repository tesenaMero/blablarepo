/*
 * {
    TODO Example interface data
  }
*/

import {
  ProductType,
  ProjectProperties,
} from './index';

interface Required {
  creationDateTime: string;
  isFavorite: boolean;
  projectId: number;
}

interface Optional {
  productType: ProductType;
  projectProperties: ProjectProperties;
}

export type Project = Required & Partial<Optional>;

export default Project;
