import { Controller, Get, Post } from '@nestjs/common';
import { CircuitBreakerService } from './circuit-breaker.service';

@Controller('circuit-breaker')
export class CircuitBreakerController {
  constructor(private readonly circuitBreakerService: CircuitBreakerService) {}

  @Get('unreliable-call')
  async makeUnreliableCall() {
    try {
      const result = await this.circuitBreakerService.unreliableServiceCall();
      return { status: 'success', result };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  @Get('http-call')
  async makeHttpCall() {
    try {
      const result = await this.circuitBreakerService.httpClientCall('https://api.example.com');
      return { status: 'success', result };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  @Get('state')
  getState() {
    return this.circuitBreakerService.getState();
  }

  @Post('reset')
  resetCircuit() {
    // Note: In a real implementation, this would reset the circuit breaker state
    return { message: 'Circuit breaker reset functionality would go here' };
  }
}