'use client';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../lib/axios';
import { setCredentials } from '../../store/slices/authSlice';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  // Email validation
  const validateEmail = (email) => {
    return email.includes('@');
  };

  // Password validation
  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const hasCapitalLetter = /[A-Z]/.test(password);
    const hasSmallLetter = /[a-z]/.test(password);
    
    return {
      isValid: hasMinLength && hasSpecialChar && hasCapitalLetter && hasSmallLetter,
      hasMinLength,
      hasSpecialChar,
      hasCapitalLetter,
      hasSmallLetter,
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Real-time validation
    const newValidationErrors = { ...validationErrors };
    if (name === 'email') {
      if (!validateEmail(value) && value) {
        newValidationErrors.email = 'Email must contain @ symbol';
      } else {
        delete newValidationErrors.email;
      }
    } else if (name === 'password') {
      const passwordValidation = validatePassword(value);
      if (!passwordValidation.isValid && value) {
        const errors = [];
        if (!passwordValidation.hasMinLength) errors.push('at least 8 characters');
        if (!passwordValidation.hasCapitalLetter) errors.push('one capital letter');
        if (!passwordValidation.hasSmallLetter) errors.push('one small letter');
        if (!passwordValidation.hasSpecialChar) errors.push('one special character');
        newValidationErrors.password = `Password must include: ${errors.join(', ')}`;
      } else {
        delete newValidationErrors.password;
      }
    }
    setValidationErrors(newValidationErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Final validation before submission
    const errors = {};
    if (!form.name.trim()) errors.name = 'Name is required';
    if (!validateEmail(form.email)) errors.email = 'Email must contain @ symbol';
    
    const passwordValidation = validatePassword(form.password);
    if (!passwordValidation.isValid) {
      const passwordErrors = [];
      if (!passwordValidation.hasMinLength) passwordErrors.push('at least 8 characters');
      if (!passwordValidation.hasCapitalLetter) passwordErrors.push('one capital letter');
      if (!passwordValidation.hasSmallLetter) passwordErrors.push('one small letter');
      if (!passwordValidation.hasSpecialChar) passwordErrors.push('one special character');
      errors.password = `Password must include: ${passwordErrors.join(', ')}`;
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post('/auth/register', form);
      dispatch(setCredentials(data));
      router.push('/shop');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="hidden lg:flex w-1/2 bg-gray-950 flex-col justify-between p-14">
        <div>
          <h1 className="text-white text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>ShopEase</h1>
          <p className="text-gray-500 text-sm mt-1">Premium E-Commerce</p>
        </div>
        <div>
          <p className="text-white text-4xl font-bold leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Join millions of<br />happy shoppers.
          </p>
          <p className="text-gray-400 mt-4 text-sm">Free shipping on your first order.</p>
        </div>
        <div className="flex gap-8">
          {['Free Returns', 'Secure Payment', 'Best Prices'].map(t => (
            <p key={t} className="text-white text-sm font-medium">{t}</p>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h2>
          <p className="text-gray-500 text-sm mb-8">Start your shopping journey today</p>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
              { name: 'email', label: 'Email address', type: 'email', placeholder: 'you@example.com' },
              { name: 'password', label: 'Password', type: 'password', placeholder: 'Min 8 characters with uppercase, lowercase & special' },
            ].map((f) => (
              <div key={f.name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{f.label}</label>
                <input
                  type={f.type} name={f.name} value={form[f.name]}
                  onChange={handleChange} required placeholder={f.placeholder}
                  className={`w-full bg-white border rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 transition ${
                    validationErrors[f.name]
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-200 focus:ring-gray-900'
                  }`}
                />
                {validationErrors[f.name] && (
                  <p className="text-red-600 text-xs mt-2">{validationErrors[f.name]}</p>
                )}
              </div>
            ))}
            <button
              type="submit" disabled={loading || Object.keys(validationErrors).length > 0}
              className="w-full bg-gray-950 text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-gray-900 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}