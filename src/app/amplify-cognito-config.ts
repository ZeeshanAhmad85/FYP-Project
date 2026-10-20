"use client";

import { Amplify, type ResourcesConfig } from "aws-amplify";
import outputs from '../../amplify_outputs.json';

Amplify.configure(outputs, {
  ssr: true 
});

export default function ConfigureAmplifyClientSide() {
  return null;
}
