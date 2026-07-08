import { useEffect, useMemo, useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { RESEND_CODE, VERIFY_EMAIL } from '../api/operations/authOperations';
import AuthShell from '../components/auth/AuthShell';
import ErrorToast from '../components/auth/ErrorToast';
import LoadingSpinner from '../components/auth/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { getFriendlyErrorMessage } from '../utils/errorMessage';

const resendCooldownSeconds = 60;

const initialVerificationForm = {
  code: '',
};

function normalizeCode(value) {
  return value
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, 6)
    .toUpperCase();
}

function validateVerificationForm({ code }) {
  if (code.length !== 6) {
    return 'Enter the 6-digit alpha-numeric token sent to your email.';
  }

  return '';
}

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [verifyEmail] = useMutation(VERIFY_EMAIL);
  const [resendCode] = useMutation(RESEND_CODE);
  const email = useMemo(
    () => location.state?.email || searchParams.get('email') || '',
    [location.state?.email, searchParams],
  );
  const [formState, setFormState] = useState(initialVerificationForm);
  const [errorMessage, setErrorMessage] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSecondsLeft, setResendSecondsLeft] = useState(resendCooldownSeconds);

  useEffect(() => {
    if (resendSecondsLeft <= 0) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setResendSecondsLeft((currentSeconds) => currentSeconds - 1);
    }, 1000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [resendSecondsLeft]);

  if (user.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!email) {
    return <Navigate to="/signup" replace />;
  }

  function handleCodeChange(event) {
    const code = normalizeCode(event.target.value);

    setFormState({ code });
    setErrorMessage('');
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationError = validateVerificationForm(formState);

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setNoticeMessage('');

    try {
      const { data } = await verifyEmail({
        variables: {
          code: formState.code,
          email,
        },
      });

      if (data?.verifyEmail?.success === false) {
        throw new Error(data.verifyEmail.message || 'Unable to verify that code.');
      }

      navigate('/login', {
        replace: true,
        state: { notice: data?.verifyEmail?.message || 'Email verified. You can now log in.' },
      });
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error, 'Unable to verify that code.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResendCode() {
    if (resendSecondsLeft > 0) {
      return;
    }

    setIsResending(true);
    setErrorMessage('');
    setNoticeMessage('');

    try {
      const { data } = await resendCode({
        variables: { email, actionType: "password_reset"},
      });

      setNoticeMessage(data?.resendCode?.message || 'A new verification code has been sent.');
      setResendSecondsLeft(resendCooldownSeconds);
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error, 'Unable to resend your verification code.'));
    } finally {
      setIsResending(false);
    }
  }

  return (
    <AuthShell
      eyebrow="The Tafach Kitchen Team"
      title="Verify your email"
      description={`Enter the 6-digit alpha-numeric token sent to ${email}.`}
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
          <span className="text-sm font-medium">Verification Code</span>
          <input
            className="tafach-input h-14 text-center text-xl font-bold uppercase tracking-[0.35em]"
            name="code"
            value={formState.code}
            onChange={handleCodeChange}
            autoComplete="one-time-code"
            inputMode="text"
            maxLength={6}
            disabled={isSubmitting}
          />
        </label>

        <button
          className="mt-grid-1 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-tafach-orange px-grid-2 text-sm font-semibold text-white transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? <LoadingSpinner /> : null}
          {isSubmitting ? 'Verifying' : 'Verify email'}
        </button>

        <button
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md px-grid-2 text-sm font-semibold text-tafach-orange transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={handleResendCode}
          disabled={resendSecondsLeft > 0 || isResending}
        >
          {isResending ? <LoadingSpinner /> : null}
          {resendSecondsLeft > 0 ? `Resend Code in ${resendSecondsLeft}s` : 'Resend Code'}
        </button>

        <p className="text-center text-sm text-tafach-muted">
          Used a different email?{' '}
          <Link className="font-semibold text-tafach-orange" to="/signup">
            Create a new account
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
