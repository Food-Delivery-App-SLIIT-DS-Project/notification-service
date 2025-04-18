/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unused-vars */
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

  @EventPattern('DELIVERY_ASSIGNED')
  async handleOrderAssigned(@Payload() data: any) {
    try {
      console.log('📦 Received DELIVERY_ASSIGNED event:', data);
  
      const { userId, orderId, pickupLocation } = data;
  
      if (!pickupLocation || !pickupLocation.lat || !pickupLocation.lng) {
        console.warn('⚠️ Missing pickup location in DELIVERY_ASSIGNED:', data);
        return; // Important: avoids crash and lets Kafka mark as "handled"
      }
  
      const message = `🚚 New delivery assigned for Order ${orderId}. Pickup at ${pickupLocation.lat},${pickupLocation.lng}`;
      
      await this.notificationService.notifyDeliveryPerson(message);
  
      console.log('✅ Notification sent to delivery personnel');
    } catch (error) {
      console.error('🚨 Error handling DELIVERY_ASSIGNED event:', error);
      // Optionally: rethrow if you want Kafka to retry (not recommended for permanent errors)
      // throw error;
    }
  }
  
}
