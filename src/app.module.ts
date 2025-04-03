import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationModule } from 'notification/notification.module';

@Module({
  imports: [
    NotificationModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/default-db',
    ),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
