import Link from "next/link";
import type { ReactNode } from "react";

type ShellProps = {
  title: string;
  eyebrow?: string;
  children: ReactNode;
};

export function ConfigShell({ title, eyebrow, children }: ShellProps) {
  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">{eyebrow ?? "CONFIGURATION"}</p>
          <h1>{title}</h1>
        </div>
        <nav className="top-actions" aria-label="Configuration navigation">
          <Link className="button reset" href="/config">
            All configuration
          </Link>
          <Link className="button reset" href="/">
            Calculator
          </Link>
        </nav>
      </header>
      {children}
    </main>
  );
}

type NotFoundProps = {
  entityLabel: string;
  indexHref: string;
  indexLabel: string;
};

export function ConfigNotFound({
  entityLabel,
  indexHref,
  indexLabel,
}: NotFoundProps) {
  return (
    <section className="panel" role="alert">
      <h2>{entityLabel} not found</h2>
      <p>
        We couldn&apos;t find that {entityLabel.toLowerCase()}. It may have been
        deleted, or the link may be wrong.
      </p>
      <Link className="button secondary" href={indexHref}>
        {indexLabel}
      </Link>
    </section>
  );
}
