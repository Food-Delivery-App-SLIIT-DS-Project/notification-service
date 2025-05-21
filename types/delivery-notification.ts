export type DeliveryNotification = {
  orderId: string;
  customerName: string;
  customerMobile: string;
  distance: number;

  pickupLocation: {
    lat: number;
    lng: number;
  };
  dropoffLocation: {
    lat: number;
    lng: number;
  };
  total: number;
  token: string;
};
