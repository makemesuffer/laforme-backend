export enum PURCHASE_STATUS {
  CREATED = 0, //'Сформирован',
  AWAITING_PAYMENT = 1, //'Ожидает оплаты',
  PAID = 2, //'Оплачено',
  AWAITING_SEND = 3, //'Ожидает отправки',
  SENT = 4, //'Отправлено',
  RECEIVED = 5, //'Получено',
  CANCELLED = 6, //'Отменено',
  RETURNED = 7, // 'Вовращен отправителю',
  REFUSED_TO_BUY = 8, //'Возвращен по гарантии',
}
export const PURCHASE_STATUS_INFO = {
  0: 'Сформирован',
  1: 'Ожидает оплаты',
  2: 'Оплачено',
  3: 'Ожидает отправки',
  4: 'Отправлено',
  5: 'Получено',
  6: 'Отменено',
  7: 'Вовращен отправителю',
  8: 'Возвращен по гарантии',
};

export enum DELIVERY_TYPE {
  PICKUP = 1,
  POST_OFFICE = 2,
  CDEK_COURIER = 3,
  CDEK_POINT = 4,
}
