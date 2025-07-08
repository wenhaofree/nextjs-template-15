import { loadStripe } from '@stripe/stripe-js';
import { useSession } from 'next-auth/react';

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not set');
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

interface StripePaymentProps {
  amount: number;
  currency?: string;
}

export default function StripePayment({ amount, currency = 'usd' }: StripePaymentProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <button className="px-4 py-2 bg-gray-400 text-white rounded-md" disabled>
      Loading...
    </button>;
  }

  const handlePayment = async () => {
    try {
      if (!session?.user?.email) {
        return;
      }

      const response = await fetch('/api/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          price: amount,
          currency,
          email: session.user.email,
          successUrl: `${window.location.origin}/orders?session_id={CHECKOUT_SESSION_ID}&amount=${amount}`,
          cancelUrl: `${window.location.origin}/#pricing`
        }),
      });

      const data = await response.json();

      if (!data.id) {
        throw new Error('No session ID returned');
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: data.id,
      });

      if (error) {
        // Error handling for Stripe checkout
      }
    } catch (error) {
      // Error handling for payment
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
    >
      Pay ${amount} {currency.toUpperCase()}
    </button>
  );
}
