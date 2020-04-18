import axios from 'axios';
import { showAlert } from './alerts';


export const bookTour = async tourId => {
    const stripe = Stripe('pk_test_swa8KgRrQ0rFbYIDCBuDH5XA00rngywvha');

    try {
        // 1.Get checkout session from API
        const session = await axios(`http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`);

        // 2.Create checkout form + charge the credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        })

    } catch (err) {
        showAlert('error', err);
    }
}