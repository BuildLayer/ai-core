# Core Package Tests

This directory contains comprehensive tests for the AI UI SDK core package.

## Test Structure

```text
src/test/
├── setup.ts                 # Test setup and mocks
├── chat-store.test.ts       # ChatStore functionality tests
├── adapters.test.ts         # Provider adapter tests
├── tools.test.ts            # Tool system tests
├── integration.test.ts      # Integration tests
└── README.md               # This file
```

## Test Categories

### 1. ChatStore Tests (`chat-store.test.ts`)

Tests the core ChatStore functionality:

- **Initialization**: Store creation and configuration
- **Message Management**: Sending, receiving, and storing messages
- **Streaming**: Real-time response streaming
- **Tool Calling**: Tool execution and result handling
- **Session Management**: Session state and history
- **State Subscription**: State change notifications
- **Error Handling**: Error scenarios and recovery

### 2. Provider Adapter Tests (`adapters.test.ts`)

Tests all provider adapters:

- **OpenAI Adapter**: Configuration and chat functionality
- **Anthropic Adapter**: Claude integration
- **Mistral Adapter**: Mistral AI integration
- **Grok Adapter**: Grok AI integration
- **Local LLM Adapter**: Local model integration
- **TetherAI Adapter**: Generic TetherAI integration
- **Error Handling**: Provider error scenarios

### 3. Tool System Tests (`tools.test.ts`)

Tests the tool system:

- **Built-in Tools**: Weather tool and other built-in tools
- **Tool Definition**: Tool schema and validation
- **Tool Execution**: Tool execution with arguments
- **Tool Context**: Context handling and logging
- **Error Handling**: Tool execution errors

### 4. Integration Tests (`integration.test.ts`)

Tests system integration:

- **Multi-provider Integration**: Multiple providers working together
- **Session Management**: Cross-provider session handling
- **Tool Integration**: Tool execution within chat flow
- **State Management**: State synchronization
- **Error Handling**: System-wide error handling

## Running Tests

### Run All Core Tests

```bash
cd packages/core
pnpm test
```

### Run Specific Test Files

```bash
# Run ChatStore tests
pnpm test chat-store.test.ts

# Run adapter tests
pnpm test adapters.test.ts

# Run tool tests
pnpm test tools.test.ts

# Run integration tests
pnpm test integration.test.ts
```

### Run Tests with Coverage

```bash
pnpm test --coverage
```

### Run Tests in Watch Mode

```bash
pnpm test --watch
```

## Test Setup

The `setup.ts` file configures the test environment:

- **Mocks**: External dependencies and APIs
- **Global Setup**: Test environment configuration
- **Utilities**: Common test utilities and helpers

## Mock Data

Tests use realistic mock data:

- **Provider Responses**: Streaming responses from AI providers
- **Tool Results**: Tool execution results
- **Error Scenarios**: Various error conditions
- **User Input**: Different user input scenarios

## Test Utilities

Common test utilities are available:

- **Mock Providers**: Pre-configured mock providers
- **Test Data**: Reusable test data and fixtures
- **Assertions**: Custom assertions for specific scenarios
- **Helpers**: Test helper functions

## Best Practices

### Writing Tests

1. **Test One Thing**: Each test should focus on one specific behavior
2. **Use Descriptive Names**: Test names should clearly describe what is being tested
3. **Arrange-Act-Assert**: Structure tests with clear setup, execution, and verification
4. **Mock External Dependencies**: Use mocks for external APIs and services
5. **Test Error Scenarios**: Include tests for error conditions and edge cases

### Test Organization

1. **Group Related Tests**: Use `describe` blocks to group related tests
2. **Use Setup and Teardown**: Use `beforeEach` and `afterEach` for test setup
3. **Keep Tests Independent**: Tests should not depend on each other
4. **Use Realistic Data**: Use realistic test data that matches production scenarios

### Mocking

1. **Mock External APIs**: Mock all external API calls
2. **Use Consistent Mocks**: Use consistent mock implementations across tests
3. **Verify Mock Calls**: Verify that mocks are called with expected parameters
4. **Reset Mocks**: Reset mocks between tests to avoid interference

## Troubleshooting

### Common Issues

1. **Tests Failing Intermittently**: Check for race conditions or timing issues
2. **Mock Not Working**: Verify mock setup and import order
3. **Async Test Hanging**: Ensure proper async/await usage
4. **Test Data Issues**: Verify test data matches expected formats

### Debugging

1. **Use Console Logs**: Add console logs to understand test execution
2. **Run Individual Tests**: Run specific tests to isolate issues
3. **Check Mock Calls**: Verify mock functions are called as expected
4. **Review Test Setup**: Ensure test setup is correct

## Coverage

### Coverage Targets

- **Statements**: > 90%
- **Branches**: > 85%
- **Functions**: > 90%
- **Lines**: > 90%

### Coverage Reports

Coverage reports are generated in the `coverage/` directory:

- **HTML Report**: `coverage/index.html`
- **JSON Report**: `coverage/coverage-final.json`
- **Text Report**: Console output

## Contributing

### Adding New Tests

1. **Follow Naming Convention**: Use descriptive test names
2. **Add to Appropriate File**: Add tests to the most relevant test file
3. **Update Documentation**: Update this README if adding new test categories
4. **Ensure Coverage**: Verify new tests improve coverage

### Test Review

1. **Code Review**: All tests are reviewed with code changes
2. **Quality Gates**: Test quality is enforced in reviews
3. **Best Practices**: Follow established testing best practices
4. **Documentation**: Keep test documentation up to date
