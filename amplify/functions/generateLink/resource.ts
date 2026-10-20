import { defineFunction } from '@aws-amplify/backend';

export const generateLink = defineFunction({
  name: 'generateLink',
  entry: './handler.ts'
});