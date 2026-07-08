import { Link } from 'react-router-dom';

export default function AuthShell({ eyebrow, title, description, children }) {
  return (
    <main className="min-h-screen bg-tafach-light px-grid-2 py-grid-4 text-tafach-dark">
      <section className="mx-auto grid w-full max-w-5xl gap-grid-4 md:grid-cols-[1fr_420px] md:items-center">
        <div className="flex flex-col gap-grid-2">
          <Link className="text-sm font-semibold uppercase text-tafach-orange" to="/">
            {eyebrow}
          </Link>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="max-w-xl text-tafach-muted">{description}</p>
        </div>

        {children}
      </section>
    </main>
  );
}
