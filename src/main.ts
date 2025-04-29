import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigModule } from '@nestjs/config';

async function bootstrap() {
  // Load environment variables
  void ConfigModule.forRoot({ isGlobal: true });
  const host = process.env.HOST || 'localhost';
  const port = process.env.PORT || '50054';
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
        },
        consumer: {
          groupId: 'notification-consumer',
        },
      },
    },
  );
  app.enableShutdownHooks();
  await app.listen();
  console.log(`Notification service is running on: http://${host}:${port}`);
}
void bootstrap();
