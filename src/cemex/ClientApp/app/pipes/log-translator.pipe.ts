import { Pipe, PipeTransform } from '@angular/core';

const statuses = {
  draft: 'DRFT',
  pending: 'PEND',
  concluded: 'COMP',
  editMode: 'IPCO',
  inProgress: 'INPR',
  delivered: 'DELV',
  blocked: 'BLCK',
  hold: 'OHLD',
  canceled: 'CNCL',
  editing: 'DDRF'
};

@Pipe({
  name: 'logTranslator'
})
export class LogTranslator implements PipeTransform {
  transform(log): string {
    if (log.action === 'POST') {
      return "views.order_details.logs.order_placed_order";
    }
  
    if (log.action === 'PUT') {
      return "views.order_details.logs.order_edited_order";
    }
  
    if (log.action === 'PATCH') {
      const previousPayload = JSON.parse(log.previousPayload);
      const newPayload = JSON.parse(log.newPayload);
  
      switch (newPayload.status.statusCode) {
        case statuses.blocked:
          return "views.order_details.logs.order_blocked"; // ha bloqueado el pedido
        case statuses.editMode:
          return "views.order_details.logs.order_started_editing_order"; // ha empezado a editar el pedido
        case statuses.pending:
          return (previousPayload.status.statusCode === statuses.blocked) ? 'views.order_details.logs.order_unblocked' :
          (previousPayload.status.statusCode == statuses.hold) ? 'views.order_details.logs.order_unhold' :
            (previousPayload.status.statusCode == statuses.editing) ? 'views.order_details.logs.order_updated' :
              'views.order_details.logs.order_placed_order';
        case statuses.hold:
          return "views.order_details.logs.order_onhold"; // ha puesto en espera el pedido
        case statuses.canceled:
          return "views.order_details.logs.canceled_order"; // ha cancelado el pedido
        case statuses.concluded:
          return "views.order_details.logs.assigned_sales_order"; // ha asignado una orden de venta al pedido
        default:
          return '';
      }
    }
  
    return '';
  }
}
