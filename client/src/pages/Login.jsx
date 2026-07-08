import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

import { LOGIN_USER } from '../api/operations/authOperations';
import AuthShell from '../components/auth/AuthShell';
import ErrorToast from '../components/auth/ErrorToast';
import LoadingSpinner from '../components/auth/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { getFriendlyErrorMessage } from '../utils/errorMessage';

const initialLoginForm = {
  email: '',
  password: '',
};

function validateLoginForm({ email, password }) {
  if (!email.trim()) {
    return 'Email is required.';
  }

  if (!email.includes('@')) {
    return 'Enter a valid email address.';
  }

  if (!password) {
    return 'Password is required.';
  }

  return '';
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();
  const [loginUser] = useMutation(LOGIN_USER);
  const [formState, setFormState] = useState(initialLoginForm);
  const [errorMessage, setErrorMessage] = useState('');
  const [noticeMessage, setNoticeMessage] = useState(location.state?.notice || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const redirectPath = location.state?.from?.pathname || '/';

  if (user.isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
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

    const validationError = validateLoginForm(formState);

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setNoticeMessage('');

    try {
      const { data } = await loginUser({
        variables: {
          email: formState.email.trim(),
          password: formState.password,
        },
      });

      const token = data?.loginUser?.token;

      if (!token) {
        throw new Error('Login succeeded, but no authentication token was returned.');
      }

      login(token);
      navigate('/', { replace: true });
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error, 'Unable to log in with those credentials.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      eyebrow="The Tafach Kitchen Team"
      title="Welcome back"
      description="Log in to bookmark recipes, share cooking notes, and publish your own dishes."
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

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Password</span>
          <input
            className="tafach-input"
            name="password"
            type="password"
            value={formState.password}
            onChange={handleFieldChange}
            autoComplete="current-password"
            disabled={isSubmitting}
          />
        </label>

        <Link className="text-sm font-semibold text-tafach-orange" to="/forgot-password">
          Forgot Password? Recovery here
        </Link>

        <button
          className="mt-grid-1 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-tafach-orange px-grid-2 text-sm font-semibold text-white transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? <LoadingSpinner /> : null}
          {isSubmitting ? 'Logging in' : 'Log in'}
        </button>

        <p className="text-center text-sm text-tafach-muted">
          New to Tafach?{' '}
          <Link className="font-semibold text-tafach-orange" to="/signup">
            Create an account
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
