import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { EmailModule } from './email/email.module';
import { SmsModule } from './sms/sms.module';
import { NotificationEventHandler } from './events/handlers';

@Module({
  imports: [EmailModule, SmsModule],
  controllers: [NotificationController, NotificationEventHandler],
  providers: [NotificationService],
})
export class NotificationModule {}
