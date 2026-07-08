import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { FORGOT_PASSWORD } from '../api/operations/authOperations';
import AuthShell from '../components/auth/AuthShell';
import ErrorToast from '../components/auth/ErrorToast';
import LoadingSpinner from '../components/auth/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { getFriendlyErrorMessage } from '../utils/errorMessage';

const secureRecoveryMessage = 'If that account matches our records, a code has been sent';

const initialForgotPasswordForm = {
  email: '',
};

function validateForgotPasswordForm({ email }) {
  if (!email.trim()) {
    return 'Email is required.';
  }

  if (!email.includes('@')) {
    return 'Enter a valid email address.';
  }

  return '';
}

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [forgotPassword] = useMutation(FORGOT_PASSWORD);
  const [formState, setFormState] = useState(initialForgotPasswordForm);
  const [errorMessage, setErrorMessage] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  function handleFieldChange(event) {
    const { name, value } = event.target;

    setFormState((currentFormState) => ({
      ...currentFormState,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationError = validateForgotPasswordForm(formState);

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setNoticeMessage('');

    try {
      const recoveryEmail = formState.email.trim();

      await forgotPassword({
        variables: {
          email: recoveryEmail,
        },
      });

      setNoticeMessage(secureRecoveryMessage);
      navigate(`/reset-password?email=${encodeURIComponent(recoveryEmail)}`, {
        state: { notice: secureRecoveryMessage, email: recoveryEmail },
      });
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error, 'Unable to start password recovery.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      eyebrow="The Tafach Kitchen Team"
      title="Recover your password"
      description="Request a secure reset code for your Tafach Kitchen account."
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
          <span className="text-sm font-medium">Email</span>
          <input
            className="tafach-input"
            name="email"
            type="email"
            value={formState.email}
            onChange={handleFieldChange}
            autoComplete="email"
            disabled={isSubmitting}
          />
        </label>

        <button
          className="mt-grid-1 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-tafach-orange px-grid-2 text-sm font-semibold text-white transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? <LoadingSpinner /> : null}
          {isSubmitting ? 'Sending code' : 'Send recovery code'}
        </button>

        <p className="text-center text-sm text-tafach-muted">
          Remembered your password?{' '}
          <Link className="font-semibold text-tafach-orange" to="/login">
            Log in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
