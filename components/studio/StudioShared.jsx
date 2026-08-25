import { ArrowRight } from '../shared/Icons';

export function StudioPage({ children, className = '' }) {
  return <main className={`studio-page ${className}`.trim()}>{children}</main>;
}

export function StudioPageHeader({ kicker, title, description, action }) {
  return (
    <header className="studio-page-head">
      <div>
        {kicker && <span className="studio-kicker">{kicker}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action && <div className="studio-page-action">{action}</div>}
    </header>
  );
}

export function StatusBadge({ status, label }) {
  const text = label || String(status || '').replaceAll('_', ' ');
  return <span className={`studio-status studio-status--${String(status || 'neutral').replaceAll('_', '-')}`}>{text}</span>;
}

export function LoadingState({ label = 'Loading the workspace…' }) {
  return <div className="studio-state studio-state--loading"><span className="studio-spinner" aria-hidden="true" />{label}</div>;
}

export function ErrorState({ message = 'Something went wrong. Please try again.' }) {
  return <div className="studio-state studio-state--error" role="alert">{message}</div>;
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="studio-empty">
      <span className="studio-empty-mark" aria-hidden="true">—</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}

export function formatStudioDate(value, options = {}) {
  if (!value) return 'Not scheduled';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not scheduled';
  return new Intl.DateTimeFormat('en-GH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(date);
}

export function formatStudioDateTime(value) {
  return formatStudioDate(value, { hour: 'numeric', minute: '2-digit' });
}

export function formatStudioSaveTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-GH', { hour: 'numeric', minute: '2-digit' }).format(date);
}

export function FieldError({ id, children }) {
  if (!children) return null;
  return <span className="studio-field-error" id={id} role="alert">{children}</span>;
}

export function StudioLinkAction({ href, children }) {
  return <a className="studio-inline-action" href={href}>{children}<ArrowRight size={14} /></a>;
}

export function normalizeSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
