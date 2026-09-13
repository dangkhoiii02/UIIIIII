import type { ReactNode } from 'react';
export function Card({
  title,
  icon,
  children,
}: {
  title: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="card">
      <div className="card-title">
        <span className="card-symbol">{icon}</span>
        <h3>{title}</h3>
      </div>
      <div className="body">{children}</div>
    </section>
  );
}
