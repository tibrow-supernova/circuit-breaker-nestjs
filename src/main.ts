import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { demonstrateCircuitBreaker, apiCallExample } from './example-usage';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Run circuit breaker demonstrations when starting the app
  console.log('Starting Circuit Breaker demonstrations...\n');
  demonstrateCircuitBreaker()
    .then(() => apiCallExample())
    .catch(error => console.error('Error in demonstration:', error));
  
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: http://localhost:3000`);
}
bootstrap();
