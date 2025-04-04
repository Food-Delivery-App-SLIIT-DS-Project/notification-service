import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        protoPath: join(__dirname, '../notification.proto'),
        package: 'notification',
        url: 'localhost:50054',
      },
    },
  );
  app.enableShutdownHooks();
  await app.listen();
  console.log('Notification service is running on: http://localhost:50054');
}
void bootstrap();
