# Circuit Breaker Pattern Implementation

This project demonstrates the implementation and usage of the Circuit Breaker pattern in a NestJS application. The circuit breaker helps prevent cascading failures in distributed systems by temporarily stopping requests to failing services.

## Overview

The Circuit Breaker pattern is a design pattern used to prevent a failure in one part of a system from cascading and causing failures throughout the entire system. It works similarly to an electrical circuit breaker that trips when there's an overload, protecting the electrical system from damage.

### Features

- Three-state circuit breaker: CLOSED, OPEN, HALF_OPEN
- Configurable failure threshold
- Configurable timeout periods
- Real-time state monitoring
- REST API endpoints for testing
- Example usage scenarios

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

## Running the Application

### Development Mode
```bash
npm run start
```

The application will be available at `http://localhost:3000`

### Production Mode
```bash
npm run build
npm run start:prod
```

## Testing the Circuit Breaker

### Manual Testing via REST API

The application provides several endpoints to test the circuit breaker:

1. **Make an unreliable service call:**
   ```
   GET http://localhost:3000/circuit-breaker/unreliable-call
   ```

2. **Make an HTTP call (simulated):**
   ```
   GET http://localhost:3000/circuit-breaker/http-call
   ```

3. **Check current circuit state:**
   ```
   GET http://localhost:3000/circuit-breaker/state
   ```

### Automatic Testing

Run the unit tests:
```bash
npm run test
```

Run tests in watch mode:
```bash
npm run test:watch
```

### Example Test Scenario

1. Start the application: `npm run start`
2. Open your browser or use a tool like curl/Postman
3. Call the unreliable service endpoint multiple times:
   ```
   GET http://localhost:3000/circuit-breaker/unreliable-call
   ```
4. Watch the console logs and state endpoint to see the circuit breaker transition from CLOSED to OPEN
5. After the timeout period, observe the transition to HALF_OPEN when the circuit attempts to recover

## Implementation Details

### Circuit Breaker States

- **CLOSED**: Normal operation; requests pass through to the service
- **OPEN**: Circuit breaker has tripped; requests fail immediately
- **HALF_OPEN**: Testing if the service has recovered

### Configuration Parameters

- `threshold`: Number of consecutive failures before opening the circuit (default: 5)
- `timeout`: Time in milliseconds to wait in OPEN state before attempting reset (default: 60,000ms)
- `resetTimeout`: Time to wait in HALF_OPEN state before reverting to OPEN (default: 10,000ms)

### Code Structure

- `src/circuit-breaker.ts`: Core circuit breaker implementation
- `src/circuit-breaker.service.ts`: Service that uses the circuit breaker
- `src/circuit-breaker.controller.ts`: REST API endpoints
- `src/example-usage.ts`: Demonstrates circuit breaker usage
- `src/circuit-breaker.spec.ts`: Unit tests

## How the Circuit Breaker Works

1. Initially, the circuit breaker is in the CLOSED state
2. When operations succeed, the breaker remains closed
3. When operations fail, the breaker increments its failure counter
4. If failures exceed the threshold, the breaker opens (OPEN state)
5. In the OPEN state, all requests fail immediately without contacting the service
6. After the timeout period, the breaker enters HALF_OPEN state and allows one test call
7. If the test call succeeds, the breaker returns to CLOSED
8. If the test call fails, the breaker returns to OPEN

## Use Cases

The Circuit Breaker pattern is useful in scenarios involving:
- Remote service calls
- Database connections
- Third-party API integrations
- Resource-intensive operations
- Any operation that might fail and affect system stability

## Dependencies

- Node.js (v14+)
- NestJS
- TypeScript

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.