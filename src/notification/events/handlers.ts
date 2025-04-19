/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationService } from '../notification.service';
import { DeliveryNotification } from 'types/delivery-notification';

@Controller() // ✅ This is MANDATORY for Kafka event bindings
export class NotificationEventHandler {
  constructor(private readonly notificationService: NotificationService) {
    console.log('notificationEventHandler initialized ✅');
  }

  @EventPattern('ORDER_PLACED')
  async handleOrderPlaced(@Payload() data: any) {
    console.log('🔥 Received ORDER_PLACED event:', data);
    const { user, orderId, deliveryEstimate } = data;
    await this.notificationService.sendOrderConfirmation(
      user,
      orderId,
      deliveryEstimate,
    );
  }

  @EventPattern('DELIVERY_ASSIGNED')
  async handleOrderAssigned(@Payload() message: any) {
    try {
      const data = message.data; // 👈 unwrap actual payload
      console.log('📦 Received DELIVERY_ASSIGNED event:', data);

      const { token, orderId, pickupLocation, customerName, address, total } =
        data;

      if (!pickupLocation || !pickupLocation.lat || !pickupLocation.lng) {
        console.warn('⚠️ Missing pickup location in DELIVERY_ASSIGNED:', data);
        return;
      }

      const distance = Math.sqrt(
        Math.pow(pickupLocation.lat - 0, 2) +
          Math.pow(pickupLocation.lng - 0, 2),
      );

      const messageToSend: DeliveryNotification = {
        token,
        orderId,
        customerName,
        address,
        total,
        distance,
      };

      await this.notificationService.notifyDeliveryPerson(messageToSend);
      console.log('✅ Notification sent to delivery personnel');
    } catch (error) {
      console.error('🚨 Error handling DELIVERY_ASSIGNED event:', error);
    }
  }
}
