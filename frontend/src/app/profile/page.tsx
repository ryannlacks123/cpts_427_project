'use client';

import { useAuth } from '@/context/AuthContext';
import { getErrorMessage } from '@/services/api';
import { confirm2FA, disable2FA, enable2FA, getProfile } from '@/services/auth.service';
import { FormEvent, useState } from 'react';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [setupSecret, setSetupSecret] = useState('');
  const [setupQrCode, setSetupQrCode] = useState('');
  const [confirmCode, setConfirmCode] = useState('');
  const [disablePassword, setDisablePassword] = useState('');

  const refreshCurrentUser = async () => {
    const profile = await getProfile();
    updateUser(profile);
  };

  const handleStart2FASetup = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const data = await enable2FA();
      setSetupSecret(data.secret || '');
      setSetupQrCode(data.qrCode || '');
      setSuccess(data.message || '2FA setup started. Scan the QR code and confirm with a code.');
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm2FA = async (event: FormEvent) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const data = await confirm2FA(confirmCode);
      await refreshCurrentUser();

      setConfirmCode('');
      setSetupSecret('');
      setSetupQrCode('');
      setSuccess(data.message || '2FA enabled successfully.');
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async (event: FormEvent) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const data = await disable2FA(disablePassword);
      await refreshCurrentUser();

      setDisablePassword('');
      setConfirmCode('');
      setSetupSecret('');
      setSetupQrCode('');
      setSuccess(data.message || '2FA disabled successfully.');
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>

      <div className="card max-w-2xl">
        <div className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">{success}</div>
          )}

          <div>
            <label className="label">Name</label>
            <p className="text-lg text-gray-900">{user?.name}</p>
          </div>

          <div>
            <label className="label">Email</label>
            <p className="text-lg text-gray-900">{user?.email}</p>
          </div>

          <div>
            <label className="label">Roles</label>
            <div className="flex gap-2 mt-2">
              {user?.roles.map((role) => (
                <span
                  key={role}
                  className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Two-Factor Authentication</label>
            <p className={`text-lg ${user?.is2faEnabled ? 'text-green-600' : 'text-gray-500'}`}>
              {user?.is2faEnabled ? 'Enabled ✓' : 'Disabled'}
            </p>
          </div>

          {!user?.is2faEnabled && !setupQrCode && (
            <div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleStart2FASetup}
                disabled={loading}
              >
                {loading ? 'Starting 2FA...' : 'Enable 2FA'}
              </button>
            </div>
          )}

          {!user?.is2faEnabled && setupQrCode && (
            <div className="space-y-4 border border-gray-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900">Complete 2FA Setup</h2>
              <p className="text-sm text-gray-600">
                Scan this QR code with your authenticator app, then enter the 6-digit code below.
              </p>

              <div className="flex justify-center">
                <img src={setupQrCode} alt="2FA setup QR code" className="w-56 h-56 border border-gray-200 rounded" />
              </div>

              <div>
                <label className="label">Manual Setup Secret</label>
                <p className="text-sm font-mono bg-gray-50 border border-gray-200 rounded p-2 break-all">{setupSecret}</p>
              </div>

              <form onSubmit={handleConfirm2FA} className="space-y-3">
                <div>
                  <label htmlFor="confirmCode" className="label">Authenticator Code</label>
                  <input
                    id="confirmCode"
                    className="input"
                    value={confirmCode}
                    onChange={(e) => setConfirmCode(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Confirming...' : 'Confirm 2FA'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setError('');
                      setSuccess('');
                      setConfirmCode('');
                      setSetupSecret('');
                      setSetupQrCode('');
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {user?.is2faEnabled && (
            <div className="space-y-3 border border-gray-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900">Disable 2FA</h2>
              <p className="text-sm text-gray-600">Enter your account password to disable two-factor authentication.</p>

              <form onSubmit={handleDisable2FA} className="space-y-3">
                <div>
                  <label htmlFor="disablePassword" className="label">Password</label>
                  <input
                    id="disablePassword"
                    type="password"
                    className="input"
                    value={disablePassword}
                    onChange={(e) => setDisablePassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <button type="submit" className="btn btn-danger" disabled={loading}>
                  {loading ? 'Disabling...' : 'Disable 2FA'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
