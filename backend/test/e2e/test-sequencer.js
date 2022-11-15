/* eslint-disable @typescript-eslint/no-var-requires */
const Sequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends Sequencer {
  /**
   * @param {import('jest-runner').Test[]} tests
   */
  sort(tests) {
    const copyTests = Array.from(tests);
    return copyTests.sort((testA, testB) => {
      if (
        testA.path.includes('registration.e2e.test.ts') &&
        testB.path.includes('login.e2e.test.ts')
      ) {
        return -1;
      }

      if (
        testA.path.includes('login.e2e.test.ts') &&
        testB.path.includes('registration.e2e.test.ts')
      ) {
        return 1;
      }

      return testA.path > testB.path ? 1 : -1;
    });
  }
}

module.exports = CustomSequencer;
