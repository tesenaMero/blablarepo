/*
 * {
    TODO Example interface data
  }
*/

interface ProjectElement extends Partial<Optional> {
  elementId: number;
}

interface Optional {
  elementCode: string;
  elementDesc: string;
}

export default ProjectElement;
