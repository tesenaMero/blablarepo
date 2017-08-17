type OrderRequestItemStatuses = 'confirmed' | 'draft' | 'pending' | 'blocked' | 'onhold';

export const orderRequestItemStatuses = [
        {
            statusId: 1,
            statusDesc: 'Draft',
            statusCode: 'DRFT',
        },
        {
            statusId: 2,
            statusDesc: 'Pending',
            statusCode: 'PEND',
        },
        {
            statusId: 3,
            statusDesc: 'Confirmed',
            statusCode: 'CONF',
        },
        {
            statusId: 4,
            statusDesc: 'In Edit',
            statusCode: 'IPCO',
        },
        {
            statusId: 5,
            statusDesc: 'In Progress',
            statusCode: 'INPR',
        },
        {
            statusId: 6,
            statusDesc: 'Delivered',
            statusCode: 'DELV',
        },
        {
            statusId: 7,
            statusDesc: 'Blocked',
            statusCode: 'BLCK',
        },
        {
            statusId: 8,
            statusDesc: 'On Hold',
            statusCode: 'OHLD',
        },
        {
            statusId: 9,
            statusDesc: 'Canceled',
            statusCode: 'CNCL',
        },
];


export const orderRequestItemStatusesEs = [
        {
            statusId: 1,
            statusDesc: 'Borrador',
            statusCode: 'DRFT',
        },
        {
            statusId: 2,
            statusDesc: 'Pendiente',
            statusCode: 'PEND',
        },
        {
            statusId: 3,
            statusDesc: 'Confirmado',
            statusCode: 'CONF',
        },
        {
            statusId: 4,
            statusDesc: 'Editando',
            statusCode: 'IPCO',
        },
        {
            statusId: 5,
            statusDesc: 'En Progreso',
            statusCode: 'INPR',
        },
        {
            statusId: 6,
            statusDesc: 'Entregado',
            statusCode: 'DELV',
        },
        {
            statusId: 7,
            statusDesc: 'Bloqueado',
            statusCode: 'BLCK',
        },
        {
            statusId: 8,
            statusDesc: 'Suspendido',
            statusCode: 'OHLD',
        },
        {
            statusId: 9,
            statusDesc: 'Cancelado',
            statusCode: 'CNCL',
        },
];

export default OrderRequestItemStatuses;
