export default function ErrorToast({ message }) {
  if (!message) {
    return null;
  }

  return (
    <div
      className="rounded-md border border-rose-200 bg-rose-50 px-grid-2 py-grid-2 text-sm font-semibold leading-6 text-rose-800 shadow-sm"
      role="alert"
    >
      {message}
    </div>
  );
}
