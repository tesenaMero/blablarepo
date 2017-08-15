interface OrderRequestItemLog {
  orderReqItemLogId: number;
  username: string;
  action: string;
  datetime: string;
  previousPayload: string;
  newPayload: string;
}

export default OrderRequestItemLog;
