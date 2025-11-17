import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CircuitBreakerService } from './circuit-breaker.service';
import { CircuitBreakerController } from './circuit-breaker.controller';

@Module({
  imports: [],
  controllers: [AppController, CircuitBreakerController],
  providers: [AppService, CircuitBreakerService],
})
export class AppModule {}
