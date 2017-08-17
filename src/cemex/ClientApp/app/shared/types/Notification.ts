/**
 *
 * Notification namespace
 *
 * https://dev-cnx-gbl-apiconnect-org-development.developer.us.apiconnect.ibmcloud.com/node/18366
 *
 */

namespace Notification {
  export interface Type {
    notificationTypeId: number;
    notificationTypeDesc: string;
  }
  export interface User {
    userId: number;
    userAccount: string;
    userName: string;
  }
  export interface Status {
    statusId: number;
    statusDesc: string;
    statusTime: string;
  }
  export interface StatusLog {
    statusLogId: number;
    statusLogDesc: string;
    statusLogTime: string;
  }
  export interface View {
    viewId: number;
    user: User;
    viewedTime: string;
  }
  export interface Event {
    eventId: number;
    eventTime: string;
    instancePrimaryKey: number;
    entityName: string;
    status: Status;
    statusLogs: StatusLog[];
  }
  export interface Item {
    notificationId: number;
    notificationType: Type;
    notificationTime: string;
    user: User;
    viewed: boolean;
    viewedAt: string;
    event: Event;
  }
}

export default Notification;
