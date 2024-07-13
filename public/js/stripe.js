import { showAlert } from './alerts';
import axios from 'axios';
const stripe = Stripe(
  'pk_test_51PbkxyDQ5mitw2CT8qS5crqCxLJ2e235L2T9IeELlPwSIaT5z3p2aaGL6CPbalgEu6OvYWrrWRHjGKmCwcgF94Da00OQqtfiaK',
);

export const bookTour = async (tourId) => {
  try {
    //1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    //2) Create checkout from + change credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
