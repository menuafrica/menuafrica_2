import { loadStripe } from '@stripe/stripe-js';

// Remplacer par la vraie clé publique Stripe si nécessaire
export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || 'pk_test_dummy');
