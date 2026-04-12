'use client';

import { useAuth } from '@/context/AuthContext';
import { getErrorMessage } from '@/services/api';
import { login, verify2FA } from '@/services/auth.service';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface LoginFormData {
  email: string;
  password: string;
}

interface TwoFAFormData {
  code: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login: setAuthData } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [require2FA, setRequire2FA] = useState(false);
  const [tempToken, setTempToken] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const {
    register: register2FA,
    handleSubmit: handleSubmit2FA,
    formState: { errors: errors2FA },
  } = useForm<TwoFAFormData>();

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      setLoading(true);
      const response = await login(data);

      if (response.require2FA && response.tempToken) {
        setRequire2FA(true);
        setTempToken(response.tempToken);
      } else if (response.token && response.user) {
        setAuthData(response.token, response.user);
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const on2FASubmit = async (data: TwoFAFormData) => {
    try {
      setError('');
      setLoading(true);
      const response = await verify2FA(tempToken, data.code);

      if (response.token && response.user) {
        setAuthData(response.token, response.user);
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4">
      <div className="max-w-md w-full">
        <div className="card">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Event Resource Management</h1>
            <p className="text-gray-600 mt-2">
              {require2FA ? 'Enter your 2FA code' : 'Sign in to your account'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {!require2FA ? (
            <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-4">
              <div>
                <label htmlFor="email" className="label">
                  Email
                </label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  type="email"
                  id="email"
                  className="input"
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="label">
                  Password
                </label>
                <input
                  {...register('password', { required: 'Password is required' })}
                  type="password"
                  id="password"
                  className="input"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary w-full">
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit2FA(on2FASubmit)} className="space-y-4">
              <div>
                <label htmlFor="code" className="label">
                  2FA Code
                </label>
                <input
                  {...register2FA('code', { required: '2FA code is required' })}
                  type="text"
                  id="code"
                  className="input text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  autoComplete="off"
                />
                {errors2FA.code && (
                  <p className="mt-1 text-sm text-red-600">{errors2FA.code.message}</p>
                )}
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary w-full">
                {loading ? 'Verifying...' : 'Verify'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setRequire2FA(false);
                  setTempToken('');
                  setError('');
                }}
                className="btn btn-secondary w-full"
              >
                Back to login
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                Register
              </Link>
            </p>
          </div>
        </div>

        {/* Demo credentials */}
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
          <p className="font-semibold text-yellow-900 mb-1">Demo Credentials:</p>
          <p className="text-yellow-800">Admin: admin@example.com / Admin123!</p>
          <p className="text-yellow-800">Manager: manager@example.com / Manager123!</p>
        </div>
      </div>
    </div>
  );
}
