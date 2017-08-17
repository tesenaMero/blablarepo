/**
 *
 * Notify namespace
 *
 */

import { Notification } from './';

namespace Notify {
  export type AlertTypes = 'warning' | 'error' | 'info' | 'success';
  export interface Alert {
    content: any;
    type: AlertTypes;
    id?: number;
    event?: Notification.Event;
  }
  export interface Dialog {
    content: any;
    title?: string;
    actions?: any;
  }
}

export default Notify;
