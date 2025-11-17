import { CircuitBreaker, CircuitState } from './circuit-breaker';

// Example usage of the CircuitBreaker
async function demonstrateCircuitBreaker(): Promise<void> {
  console.log('=== Circuit Breaker Demonstration ===\n');
  
  // Create a circuit breaker with threshold of 3 failures and 10 second timeout
  const circuitBreaker = new CircuitBreaker(3, 10000);
  
  // Simulate a function that sometimes fails
  const unreliableFunction = async (): Promise<string> => {
    // Simulate 70% failure rate to trigger the circuit breaker quickly
    if (Math.random() < 0.7) {
      throw new Error('Simulated service failure');
    }
    return 'Success: Operation completed';
  };

  console.log('1. Making successful calls to close circuit (initial state)');
  for (let i = 0; i < 3; i++) {
    try {
      // Force success for first few calls
      const result = await circuitBreaker.call(async () => {
        if (i > 0) throw new Error('Simulated service failure');
        return 'Success: Operation completed';
      });
      console.log(`   Call ${i + 1}: ${result}`);
    } catch (error) {
      console.log(`   Call ${i + 1}: Failed - ${error.message}`);
    }
    console.log(`   Circuit state: ${circuitBreaker.getState()}, Failures: ${circuitBreaker.getFailureCount()}\n`);
  }

  console.log('2. Making multiple failing calls to open circuit');
  for (let i = 0; i < 5; i++) {
    try {
      const result = await circuitBreaker.call(unreliableFunction);
      console.log(`   Call ${i + 1}: ${result}`);
    } catch (error) {
      console.log(`   Call ${i + 1}: Failed - ${error.message}`);
    }
    console.log(`   Circuit state: ${circuitBreaker.getState()}, Failures: ${circuitBreaker.getFailureCount()}\n`);
  }

  console.log('3. Circuit is now OPEN - all calls will fail immediately');
  for (let i = 0; i < 2; i++) {
    try {
      const result = await circuitBreaker.call(unreliableFunction);
      console.log(`   Call ${i + 1}: ${result}`);
    } catch (error) {
      console.log(`   Call ${i + 1}: Failed - ${error.message} (circuit breaker is OPEN)`);
    }
    console.log(`   Circuit state: ${circuitBreaker.getState()}\n`);
  }

  console.log('4. Waiting for timeout to allow circuit to transition to HALF_OPEN...');
  console.log('   (In a real scenario, we would wait for the timeout period)');
  
  // Simulate waiting and then testing
  console.log('5. After timeout, circuit transitions to HALF_OPEN and allows one test call');
  // For demo purposes we'll manually reset to show the transition
  console.log('   Circuit remains OPEN until timeout, then transitions to HALF_OPEN for testing...');
}

// Alternative example with a more realistic scenario
async function apiCallExample(): Promise<void> {
  console.log('\n=== API Call Example ===\n');
  
  const apiCircuitBreaker = new CircuitBreaker(5, 30000); // 5 failures, 30s timeout
  
  // Simulate calling an external API
  const callExternalApi = async (endpoint: string): Promise<string> => {
    // Simulate network request that might fail
    if (Math.random() < 0.6) {  // 60% failure rate
      throw new Error(`Network error: Failed to reach ${endpoint}`);
    }
    return `Success: Received data from ${endpoint}`;
  };

  console.log('Making API calls with circuit breaker protection...\n');
  
  for (let i = 0; i < 10; i++) {
    try {
      const result = await apiCircuitBreaker.call(() => callExternalApi(`/api/endpoint-${i}`));
      console.log(`API Call ${i + 1}: ${result}`);
    } catch (error) {
      console.log(`API Call ${i + 1}: ${error.message}`);
    }
    console.log(`Circuit State: ${apiCircuitBreaker.getState()}`);
    console.log(`Failure Count: ${apiCircuitBreaker.getFailureCount()}\n`);
    
    // Small delay between calls to see the progression
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

// Export functions for use in main.ts
export { demonstrateCircuitBreaker, apiCallExample };

// Uncomment the following to run the demonstrations directly
// demonstrateCircuitBreaker()
//   .then(() => apiCallExample())
//   .catch(error => console.error('Error in demonstration:', error));