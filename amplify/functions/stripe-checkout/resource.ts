import { defineFunction, secret } from "@aws-amplify/backend";

export const stripeCheckoutFunc = defineFunction({
    name: 'stripe-checkout',
    entry: './handler.ts',
    environment: {
        STRIPE_SECRET: secret('stripe-secret'),
        STRIPE_WEBHOOK_SECRET: secret('stripe-webhook')
    }
});