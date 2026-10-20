import { defineFunction, secret } from '@aws-amplify/backend';

export const verifyEmail = defineFunction({
  name: 'verifyEmail',
  entry: './handler.ts',
});