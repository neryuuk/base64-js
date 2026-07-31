import { defaults } from 'jest-config';

export default {
  moduleFileExtensions: [...defaults.moduleFileExtensions],
  rootDir: '.',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  testEnvironment: 'node',
  testRegex: '.*.spec.js$',
  transform: {},
  verbose: true,
  waitForUnhandledRejections: true,
};
