import { Injectable } from '@nestjs/common';
import service_admin from './firebase-service-account';
import { DeliveryNotification } from 'types/delivery-notification';

@Injectable()
export class FirebaseService {
  async sendOrderNotification(data: DeliveryNotification) {
    const message = {
      token: data.token,
      notification: {
        title: 'New Order Available',
        body: `Order #${data.orderId} for ${data.customerName}`,
      },
      data: {
        orderId: data.orderId.toString(),
        customerName: data.customerName,
        customerMobile: data.customerMobile,
        total: data.total.toString(),
        distance: data.distance.toString(),
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
        pickupLocation: JSON.stringify(data.pickupLocation),
        dropoffLocation: JSON.stringify(data.dropoffLocation),
      },
    };

    try {
      const response = await service_admin.messaging().send(message);
      console.log('Successfully sent message:', response);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
}
