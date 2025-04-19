import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import * as serviceAccount from './firebase-service-account.json';
import { DeliveryNotification } from 'types/delivery-notification';

@Injectable()
export class FirebaseService {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  }

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
        address: data.address,
        total: data.total.toString(),
        distance: data.distance.toString(),
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
      },
    };

    try {
      const response = await admin.messaging().send(message);
      console.log('Successfully sent message:', response);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
}
