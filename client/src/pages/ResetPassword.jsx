import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { PASSWORD_RESET } from '../api/operations/authOperations';
import AuthShell from '../components/auth/AuthShell';
import ErrorToast from '../components/auth/ErrorToast';
import LoadingSpinner from '../components/auth/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { getFriendlyErrorMessage } from '../utils/errorMessage';

const initialResetPasswordForm = {
  secretCode: '',
  newPassword: '',
  confirmNewPassword: '',
};

function normalizeSecretCode(value) {
  return value.replace(/\s/g, '').slice(0, 12);
}

function validateResetPasswordForm({ secretCode, newPassword, confirmNewPassword }) {
  if (!secretCode.trim()) {
    return 'Secret code is required.';
  }

  if (newPassword.length < 8) {
    return 'New password must be at least 8 characters.';
  }

  if (newPassword !== confirmNewPassword) {
    return 'New password and confirmation must match.';
  }

  return '';
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [passwordReset] = useMutation(PASSWORD_RESET);
  const email = searchParams.get('email') || location.state?.email || '';
  const [formState, setFormState] = useState(initialResetPasswordForm);
  const [errorMessage, setErrorMessage] = useState('');
  const [noticeMessage, setNoticeMessage] = useState(location.state?.notice || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!email) {
    return <Navigate to="/forgot-password" replace />;
  }

  function handleFieldChange(event) {
    const { name, value } = event.target;

    setFormState((currentFormState) => ({
      ...currentFormState,
      [name]: name === 'secretCode' ? normalizeSecretCode(value) : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationError = validateResetPasswordForm(formState);

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setNoticeMessage('');

    try {
      const { data } = await passwordReset({
        variables: {
          email,
          newPassword: formState.newPassword,
          confirmNewPassword: formState.confirmNewPassword,
          secretCode: formState.secretCode,
        },
      });

      navigate('/login', {
        replace: true,
        state: {
          notice:
            data?.passwordReset?.message || 'Password updated. Log in with your new password.',
        },
      });
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error, 'Unable to reset your password.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      eyebrow="The Tafach Kitchen Team"
      title="Reset your password"
      description={`Enter the recovery code sent to ${email}, then choose a new password.`}
    >
      <form
        className="flex flex-col gap-grid-2 rounded-lg border border-tafach-border bg-white p-grid-3 shadow-sm"
        onSubmit={handleSubmit}
        noValidate
      >
        <ErrorToast message={errorMessage} />

        {noticeMessage ? (
          <div
            className="rounded-md border border-emerald-200 bg-emerald-50 px-grid-2 py-grid-2 text-sm font-semibold leading-6 text-emerald-800 shadow-sm"
            role="status"
          >
            {noticeMessage}
          </div>
        ) : null}

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Secret Code</span>
          <input
            className="tafach-input"
            name="secretCode"
            value={formState.secretCode}
            onChange={handleFieldChange}
            autoComplete="one-time-code"
            disabled={isSubmitting}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">New Password</span>
          <input
            className="tafach-input"
            name="newPassword"
            type="password"
            value={formState.newPassword}
            onChange={handleFieldChange}
            autoComplete="new-password"
            disabled={isSubmitting}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Confirm New Password</span>
          <input
            className="tafach-input"
            name="confirmNewPassword"
            type="password"
            value={formState.confirmNewPassword}
            onChange={handleFieldChange}
            autoComplete="new-password"
            disabled={isSubmitting}
          />
        </label>

        <button
          className="mt-grid-1 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-tafach-orange px-grid-2 text-sm font-semibold text-white transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? <LoadingSpinner /> : null}
          {isSubmitting ? 'Updating password' : 'Reset password'}
        </button>

        <p className="text-center text-sm text-tafach-muted">
          Need a new code?{' '}
          <Link className="font-semibold text-tafach-orange" to="/forgot-password">
            Start recovery again
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
