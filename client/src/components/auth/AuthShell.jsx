import { Link } from 'react-router-dom';

export default function AuthShell({ eyebrow, title, description, children }) {
  return (
    <main className="min-h-screen bg-tafach-light px-grid-2 py-grid-4 text-tafach-dark flex items-center justify-center font-brand">
      <section className="mx-auto grid w-full max-w-5xl gap-grid-4 md:grid-cols-[1fr_420px] md:items-center">
     
        <div className="flex flex-col gap-grid-1 md:pr-grid-2">
          <Link className="text-sm font-semibold uppercase text-tafach-orange tracking-wider active:scale-95 transition-transform w-fit" to="/">
            {eyebrow}
          </Link>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-none mt-2 mb-3">{title}</h1>
          <p className="max-w-md text-sm md:text-base text-tafach-muted leading-relaxed">{description}</p>
        </div>

        <div className="w-full">
          {children}
        </div>
        
      </section>
    </main>
  );
}
