import { useEffect } from 'react';

export default function SuccessPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bookingId = params.get('booking');
    
    if (bookingId) {
      // 🔁 Optional: POST to Supabase API to mark booking as confirmed
      fetch(`/api/bookings/${bookingId}/confirm`, {
        method: 'POST'
      });
    }
  }, []);

  return (
    <div className="py-16 text-center">
      <h1 className="text-green-600 text-2xl font-bold">🎉 Booking & Payment Confirmed!</h1>
      <p className="mt-4">You’ll receive an email shortly with all the details.</p>
      <a href="/adventures">
        <button className="mt-6 px-6 py-2 bg-green-600 text-white rounded">Explore More Adventures</button>
      </a>
    </div>
  );
}
