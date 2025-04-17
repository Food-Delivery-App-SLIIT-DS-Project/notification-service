import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId: 'notification-consumer',
        },
      },
    },
  );
  app.enableShutdownHooks();
  await app.listen();
  console.log('Notification service is running on: http://localhost:50054');
}
void bootstrap();
