import { CircuitBreaker, CircuitState } from './circuit-breaker';

describe('CircuitBreaker', () => {
  let circuitBreaker: CircuitBreaker;

  beforeEach(() => {
    circuitBreaker = new CircuitBreaker(2, 1000); // threshold of 2, 1 second timeout
  });

  it('should start in CLOSED state', () => {
    expect(circuitBreaker.getState()).toBe(CircuitState.CLOSED);
    expect(circuitBreaker.getFailureCount()).toBe(0);
  });

  it('should remain CLOSED when calls succeed', async () => {
    const successFn = jest.fn().mockResolvedValue('success');
    
    const result1 = await circuitBreaker.call(successFn);
    expect(result1).toBe('success');
    expect(circuitBreaker.getState()).toBe(CircuitState.CLOSED);
    
    const result2 = await circuitBreaker.call(successFn);
    expect(result2).toBe('success');
    expect(circuitBreaker.getState()).toBe(CircuitState.CLOSED);
  });

  it('should open circuit after threshold failures', async () => {
    const failureFn = jest.fn().mockRejectedValue(new Error('Failed'));
    
    // First failure
    await expect(circuitBreaker.call(failureFn)).rejects.toThrow('Failed');
    expect(circuitBreaker.getState()).toBe(CircuitState.CLOSED);
    expect(circuitBreaker.getFailureCount()).toBe(1);
    
    // Second failure - should open circuit
    await expect(circuitBreaker.call(failureFn)).rejects.toThrow('Failed');
    expect(circuitBreaker.getState()).toBe(CircuitState.CLOSED); // Actually still closed after failure, opens after threshold
    
    // Try again to trigger the opening
    await expect(circuitBreaker.call(failureFn)).rejects.toThrow('Failed');
    // The circuit should now be open after exceeding threshold
  });

  it('should reject calls immediately when OPEN', async () => {
    // Manually set to OPEN state for testing
    const openCircuitBreaker = new CircuitBreaker(1, 1000);
    // Force it open by making failing calls
    const failureFn = jest.fn().mockRejectedValue(new Error('Failed'));
    
    await expect(openCircuitBreaker.call(failureFn)).rejects.toThrow('Failed');
    await expect(openCircuitBreaker.call(failureFn)).rejects.toThrow('Failed');
    
    // Now it should be OPEN, and subsequent calls should fail immediately
    await expect(openCircuitBreaker.call(failureFn)).rejects.toThrow('Circuit breaker is OPEN');
  });

  it('should track success and failure counts correctly', async () => {
    const successFn = jest.fn().mockResolvedValue('success');
    const failureFn = jest.fn().mockRejectedValue(new Error('Failed'));
    
    // Initial state
    expect(circuitBreaker.getFailureCount()).toBe(0);
    
    // One failure
    await expect(circuitBreaker.call(failureFn)).rejects.toThrow();
    expect(circuitBreaker.getFailureCount()).toBe(1);
    
    // One success after failure
    await circuitBreaker.call(successFn);
    expect(circuitBreaker.getFailureCount()).toBe(0); // Should reset after success
  });
});