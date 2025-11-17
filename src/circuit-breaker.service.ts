import { Injectable } from '@nestjs/common';
import { CircuitBreaker } from './circuit-breaker';

@Injectable()
export class CircuitBreakerService {
  private readonly circuitBreaker = new CircuitBreaker();

  // Example service method that might fail
  async unreliableServiceCall(): Promise<string> {
    return this.circuitBreaker.call(async () => {
      // Simulate occasional failure (30% of the time)
      if (Math.random() < 0.3) {
        throw new Error('Unreliable service failed');
      }
      return 'Success: Service call completed';
    });
  }

  // Example HTTP request simulation
  async httpClientCall(url: string): Promise<string> {
    return this.circuitBreaker.call(async () => {
      // Simulate HTTP request that might fail
      if (Math.random() < 0.4) {
        throw new Error(`HTTP request to ${url} failed`);
      }
      return `Success: HTTP response from ${url}`;
    });
  }

  getState() {
    return {
      state: this.circuitBreaker.getState(),
      failureCount: this.circuitBreaker.getFailureCount(),
    };
  }
}