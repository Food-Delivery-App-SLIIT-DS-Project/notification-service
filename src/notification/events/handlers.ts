/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationService } from '../notification.service';

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

  @EventPattern('ORDER_ASSIGNED')
  async handleOrderAssigned(@Payload() data: any) {
    console.log('📦 Received ORDER_ASSIGNED event:', data);
    const { deliveryPerson, orderId, pickupLocation } = data;
    await this.notificationService.notifyDeliveryPerson(
      deliveryPerson,
      orderId,
      pickupLocation,
    );
  }
}
