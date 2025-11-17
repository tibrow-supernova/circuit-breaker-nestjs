export enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

export class CircuitBreaker<T = any> {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount: number = 0;
  private lastFailureTime: number | null = null;
  private successCount: number = 0;

  constructor(
    private readonly threshold: number = 5, // Number of failures before opening circuit
    private readonly timeout: number = 60000, // Time in milliseconds before attempting reset
    private readonly resetTimeout: number = 10000, // Time to wait in HALF_OPEN state before fallback to OPEN
  ) {}

  async call(fn: () => Promise<T>): Promise<T> {
    switch (this.state) {
      case CircuitState.OPEN:
        if (this.shouldAttemptReset()) {
          this.transitionToHalfOpen();
          return this.executeWithHalfOpen(fn);
        } else {
          throw new Error('Circuit breaker is OPEN');
        }
      case CircuitState.HALF_OPEN:
        return this.executeWithHalfOpen(fn);
      case CircuitState.CLOSED:
      default:
        return this.executeWithClosed(fn);
    }
  }

  private async executeWithClosed<T>(fn: () => Promise<T>): Promise<T> {
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private async executeWithHalfOpen<T>(fn: () => Promise<T>): Promise<T> {
    try {
      const result = await fn();
      this.onSuccess();
      this.transitionToClosed();
      return result;
    } catch (error) {
      this.onFailure();
      this.transitionToOpen();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.successCount++;
    if (this.state === CircuitState.HALF_OPEN) {
      this.transitionToClosed();
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.threshold) {
      this.transitionToOpen();
    }
  }

  private shouldAttemptReset(): boolean {
    return this.lastFailureTime !== null && 
           (Date.now() - this.lastFailureTime) >= this.timeout;
  }

  private transitionToOpen(): void {
    this.state = CircuitState.OPEN;
    console.log('Circuit breaker OPENED');
  }

  private transitionToClosed(): void {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    console.log('Circuit breaker CLOSED');
  }

  private transitionToHalfOpen(): void {
    this.state = CircuitState.HALF_OPEN;
    console.log('Circuit breaker HALF_OPEN');
  }

  getState(): CircuitState {
    return this.state;
  }

  getFailureCount(): number {
    return this.failureCount;
  }
}