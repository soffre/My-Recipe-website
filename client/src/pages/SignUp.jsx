import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { uploadImageToCloudinary } from '../api/cloudinary';
import { SIGN_UP_USER } from '../api/operations/authOperations';
import AuthShell from '../components/auth/AuthShell';
import ErrorToast from '../components/auth/ErrorToast';
import LoadingSpinner from '../components/auth/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { getFriendlyErrorMessage } from '../utils/errorMessage';

const avatarFolder = 'tafach/avatars';
const maxAvatarSizeInBytes = 5 * 1024 * 1024;

const initialSignUpForm = {
  fullName: '',
  email: '',
  password: '',
  avatarFile: null,
};

function validateSignUpForm({ fullName, email, password, avatarFile }) {
  if (!fullName.trim()) {
    return 'Full name is required.';
  }

  if (!email.trim()) {
    return 'Email is required.';
  }

  if (!email.includes('@')) {
    return 'Enter a valid email address.';
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters.';
  }

  if (avatarFile && !avatarFile.type.startsWith('image/')) {
    return 'Profile avatar must be an image file.';
  }

  if (avatarFile && avatarFile.size > maxAvatarSizeInBytes) {
    return 'Profile avatar must be 5 MB or smaller.';
  }

  return '';
}

export default function SignUp() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [signUpUser] = useMutation(SIGN_UP_USER);
  const [formState, setFormState] = useState(initialSignUpForm);
  const [errorMessage, setErrorMessage] = useState('');
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

  function handleAvatarChange(event) {
    const avatarFile = event.target.files?.[0] ?? null;

    setFormState((currentFormState) => ({
      ...currentFormState,
      avatarFile,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationError = validateSignUpForm(formState);

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const avatarUrl = formState.avatarFile
        ? await uploadImageToCloudinary(formState.avatarFile, avatarFolder)
        : null;

      await signUpUser({
        variables: {
          email: formState.email.trim(),
          password: formState.password,
          name: formState.fullName.trim(),
          avatarUrl,
        },
      });

      const verificationEmail = encodeURIComponent(formState.email.trim());

      navigate(`/verify-email?email=${verificationEmail}`, {
        replace: true,
        state: { email: formState.email.trim() },
      });
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error, 'Unable to create your account.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      eyebrow="The Tafach Kitchen Team"
      title="Create your recipe profile"
      description="Join the kitchen to save recipes, publish dishes, and build your cooking profile."
    >
      <form
        className="flex flex-col gap-grid-2 rounded-lg border border-tafach-border bg-white p-grid-3 shadow-sm"
        onSubmit={handleSubmit}
        noValidate
      >
        <ErrorToast message={errorMessage} />

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Full Name</span>
          <input
            className="tafach-input"
            name="fullName"
            value={formState.fullName}
            onChange={handleFieldChange}
            autoComplete="name"
            disabled={isSubmitting}
          />
        </label>

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
            autoComplete="new-password"
            disabled={isSubmitting}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Profile Avatar</span>
          <input
            className="tafach-input file:mr-grid-2 file:rounded-md file:border-0 file:bg-tafach-orange file:px-grid-2 file:py-1 file:text-sm file:font-semibold file:text-white"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            disabled={isSubmitting}
          />
        </label>

        <button
          className="mt-grid-1 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-tafach-orange px-grid-2 text-sm font-semibold text-white transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? <LoadingSpinner /> : null}
          {isSubmitting ? 'Creating account' : 'Create account'}
        </button>

        <p className="text-center text-sm text-tafach-muted">
          Already have an account?{' '}
          <Link className="font-semibold text-tafach-orange" to="/login">
            Log in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
