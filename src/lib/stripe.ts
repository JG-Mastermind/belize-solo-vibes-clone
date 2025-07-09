import express from 'express';
import Stripe from 'stripe';

const router = express.Router();

// ⚠️ Make sure your STRIPE_SECRET_KEY is in your .env file
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
});

router.post('/create-checkout-session', async (req, res) => {
  const { adventureTitle, totalAmount, userEmail, bookingId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency: 'bzd',
            product_data: { name: adventureTitle },
            unit_amount: totalAmount * 100, // cents
          },
          quantity: 1,
        },
      ],
      metadata: { booking_id: bookingId },
      success_url: `${process.env.FRONTEND_URL}/booking/success?booking=${bookingId}`,
      cancel_url: `${process.env.FRONTEND_URL}/booking/cancel`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe session error:', err);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

export default router;
