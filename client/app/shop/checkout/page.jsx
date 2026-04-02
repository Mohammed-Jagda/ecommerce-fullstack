'use client';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import api from '../../../lib/axios';
import { clearCartState } from '../../../store/slices/cartSlice';

export default function CheckoutPage() {
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState(''); // Specific error for phone

  const dispatch = useDispatch();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Real-time phone validation
    if (name === 'phone') {
      // Allow only numbers
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setAddress({ ...address, [name]: numericValue });
      
      // Clear error when user starts typing
      if (numericValue.length > 0) setPhoneError('');
    } else {
      setAddress({ ...address, [name]: value });
    }
  };

  // Validate phone number (exactly 10 digits, starts with 6-9)
  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPhoneError('');

    // Validate phone before submission
    if (!address.phone) {
      setPhoneError('Phone number is required');
      setLoading(false);
      return;
    }

    if (!validatePhone(address.phone)) {
      setPhoneError('Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9');
      setLoading(false);
      return;
    }

    try {
      const { data: payment } = await api.post('/payment/mock', { amount: 100 });
      
      await api.post('/orders', {
        shippingAddress: address,
        paymentIntentId: payment.paymentIntentId
      });

      dispatch(clearCartState());
      router.push('/shop/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'street', label: 'Street Address', placeholder: '123 MG Road', cols: 2 },
    { name: 'city', label: 'City', placeholder: 'Mumbai', cols: 1 },
    { name: 'state', label: 'State', placeholder: 'Maharashtra', cols: 1 },
    { name: 'pincode', label: 'Pincode', placeholder: '400001', cols: 1 },
    { name: 'phone', label: 'Phone Number', placeholder: '9999999999', cols: 1 },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-gray-400 hover:text-gray-900 text-sm mb-8 transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Cart
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
        Checkout
      </h1>
      <p className="text-gray-400 text-sm mb-8">Enter your shipping details to place the order</p>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
          <span className="w-6 h-6 bg-gray-950 text-white rounded-full flex items-center justify-center text-xs">1</span>
          Shipping Address
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            {fields.map((f) => (
              <div key={f.name} className={f.cols === 2 ? 'col-span-2' : ''}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {f.label}
                </label>
                
                <input
                  name={f.name}
                  value={address[f.name]}
                  onChange={handleChange}
                  required
                  placeholder={f.placeholder}
                  maxLength={f.name === 'phone' ? 10 : undefined}
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition ${
                    f.name === 'phone' && phoneError 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-200 focus:ring-gray-900'
                  }`}
                />

                {/* Phone specific error message */}
                {f.name === 'phone' && phoneError && (
                  <p className="mt-1 text-red-600 text-xs font-medium">
                    {phoneError}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-amber-600 text-sm">💳</span>
              <p className="text-sm font-semibold text-amber-800">Mock Payment Active</p>
            </div>
            <p className="text-xs text-amber-600">
              No real payment needed. Click below to place your order instantly.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full bg-gray-950 text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all duration-200 active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
}