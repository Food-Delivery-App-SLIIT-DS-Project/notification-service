/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { SmsService } from './sms/sms.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { DeliveryNotification } from 'types/delivery-notification';

@Injectable()
export class NotificationService {
  constructor(
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async sendOrderConfirmation(user: any, orderId: string, estimate: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const message = `Hi ${user.fullName}, your order ${orderId} has been confirmed. Estimated delivery: ${estimate}.`;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    await this.smsService.send(user.phoneNumber, message);
    await this.emailService.send(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      user.email,
      'Order Confirmation',
      `<h3>${message}</h3>`,
    );
  }

  async notifyDeliveryPerson(message: DeliveryNotification) {
    // const message = `New Order ${orderId} assigned. Pickup at: ${pickup}.`;

    console.log(message);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    // await this.smsService.send(person.phoneNumber, message);

    await this.firebaseService.sendOrderNotification(message);
    return { success: true };
  }
}
