'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from '../shared/Icons';
import { createSupabaseBrowserClient } from '../../lib/supabase/client';
import { revalidatePublicContent } from '../../lib/studio/revalidate';
import { EmptyState, ErrorState, FieldError, formatStudioDate, formatStudioSaveTime, LoadingState, normalizeSlug, StatusBadge, StudioPage, StudioPageHeader } from './StudioShared';
import { useStudioPermissions } from './StudioPermissions';

const supabase = createSupabaseBrowserClient();
const EMPTY_FORM = {
  id: '',
  title: '',
  slug: '',
  summary: '',
  field: '',
  format: 'online',
  venue: '',
  starts_at: '',
  ends_at: '',
  capacity: '',
  category: '',
  duration_minutes: '',
  attendee_count: '',
  status: 'draft',
  is_public: false,
};
const SESSION_COLUMNS = 'id, title, slug, summary, field, format, venue, starts_at, ends_at, capacity, category, duration_minutes, attendee_count, status, is_public, updated_at';

function toInputDateTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function toUtc(value) {
  return value ? new Date(value).toISOString() : null;
}

function normalizeSession(session) {
  return {
    ...session,
    starts_at: toInputDateTime(session.starts_at),
    ends_at: toInputDateTime(session.ends_at),
    capacity: session.capacity ?? '',
    duration_minutes: session.duration_minutes ?? '',
    attendee_count: session.attendee_count ?? '',
  };
}

function getVisibilityMessage(form) {
  if (!form.is_public) return 'Draft / private — this session is not visible on the public site.';
  if (form.status === 'draft') return 'Needs attention — a Draft session will not appear publicly. Choose Open or Completed before publishing.';
  return 'Published — this session is visible on the public site.';
}

export function StudioSessions() {
  const { canManageSessions, isReadOnly, roleLabel } = useStudioPermissions();
  const [sessions, setSessions] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [savedForm, setSavedForm] = useState(EMPTY_FORM);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(savedForm), [form, savedForm]);

  const load = async () => {
    if (!supabase) {
      setError('Supabase is not configured for this deployment. Add the public Supabase variables in Vercel and redeploy.');
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error: loadError } = await supabase.from('sessions').select(SESSION_COLUMNS).order('starts_at', { ascending: false, nullsFirst: false }).limit(100);
    if (loadError) setError('Sessions could not be loaded. Check your Studio access and try again.');
    const rows = data || [];
    setSessions(rows);
    setSelectedId((current) => current || rows[0]?.id || '');
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const selected = sessions.find((session) => session.id === selectedId);
  useEffect(() => {
    if (!selected) {
      if (!selectedId) {
        setForm(EMPTY_FORM);
        setSavedForm(EMPTY_FORM);
        setLastSavedAt(null);
      }
      return;
    }
    const nextForm = normalizeSession(selected);
    setForm(nextForm);
    setSavedForm({ ...nextForm });
    setLastSavedAt(selected.updated_at || null);
    setFieldErrors({});
  }, [selectedId]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const counts = useMemo(() => ({
    total: sessions.length,
    live: sessions.filter((session) => session.status === 'open').length,
    drafts: sessions.filter((session) => session.status === 'draft').length,
    past: sessions.filter((session) => session.status === 'completed').length,
  }), [sessions]);

  const confirmDiscard = () => !isDirty || window.confirm('You have unsaved session changes. Discard them?');

  const selectSession = (session) => {
    if (!confirmDiscard()) return;
    setSelectedId(session.id);
    setError('');
    setNotice('');
  };

  const startNew = () => {
    if (!confirmDiscard()) return;
    setSelectedId('');
    setForm(EMPTY_FORM);
    setSavedForm(EMPTY_FORM);
    setLastSavedAt(null);
    setFieldErrors({});
    setError('');
    setNotice('');
  };

  const updateField = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    setError('');
    setNotice('');
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = 'Enter a session title.';
    if (!form.summary.trim()) nextErrors.summary = 'Add a short summary for the session card.';
    if (form.starts_at && Number.isNaN(new Date(form.starts_at).getTime())) nextErrors.starts_at = 'Enter a valid start date and time.';
    if (form.ends_at && Number.isNaN(new Date(form.ends_at).getTime())) nextErrors.ends_at = 'Enter a valid end date and time.';
    if (form.starts_at && form.ends_at && new Date(form.ends_at) <= new Date(form.starts_at)) nextErrors.ends_at = 'Choose an end time after the start time.';
    if (form.capacity !== '' && (!Number.isFinite(Number(form.capacity)) || Number(form.capacity) < 1)) nextErrors.capacity = 'Capacity must be at least 1, or leave it blank.';
    if (form.duration_minutes !== '' && (!Number.isFinite(Number(form.duration_minutes)) || Number(form.duration_minutes) < 1)) nextErrors.duration_minutes = 'Duration must be at least 1 minute, or leave it blank.';
    if (form.attendee_count !== '' && (!Number.isFinite(Number(form.attendee_count)) || Number(form.attendee_count) < 0)) nextErrors.attendee_count = 'Attendees cannot be negative.';
    if (form.is_public && form.status === 'draft') nextErrors.visibility = 'Choose Open or Completed before publishing. Draft sessions stay private.';
    setFieldErrors(nextErrors);
    return nextErrors;
  };

  const save = async (event) => {
    event.preventDefault();
    if (!canManageSessions) {
      setError('Your Studio role is read-only for session records. Ask an admin for editing access.');
      return;
    }
    if (!supabase) {
      setError('Supabase is not configured for this deployment.');
      return;
    }
    const errors = validate();
    if (Object.keys(errors).length) {
      setError('Fix the highlighted fields before saving.');
      return;
    }

    setSaving(true);
    setError('');
    setNotice('');
    const payload = {
      title: form.title.trim(),
      slug: normalizeSlug(form.slug || form.title),
      summary: form.summary.trim(),
      field: form.field.trim() || null,
      format: form.format,
      venue: form.venue.trim() || null,
      starts_at: toUtc(form.starts_at),
      ends_at: toUtc(form.ends_at),
      capacity: form.capacity === '' ? null : Number(form.capacity),
      category: form.category.trim() || null,
      duration_minutes: form.duration_minutes === '' ? null : Number(form.duration_minutes),
      attendee_count: form.attendee_count === '' ? null : Number(form.attendee_count),
      status: form.status,
      is_public: form.is_public,
    };
    const result = form.id
      ? await supabase.from('sessions').update(payload).eq('id', form.id).select(SESSION_COLUMNS).single()
      : await supabase.from('sessions').insert(payload).select(SESSION_COLUMNS).single();
    if (result.error) {
      setError(result.error.code === '23505' ? 'That session slug is already in use. Choose a different one.' : 'Session could not be saved. Check your role and the fields above.');
      setSaving(false);
      return;
    }
    const session = result.data;
    const nextForm = normalizeSession(session);
    void revalidatePublicContent();
    setSessions((current) => form.id ? current.map((item) => item.id === session.id ? session : item) : [session, ...current]);
    setSelectedId(session.id);
    setForm(nextForm);
    setSavedForm({ ...nextForm });
    setLastSavedAt(session.updated_at || new Date().toISOString());
    setFieldErrors({});
    setNotice(form.id ? 'Session saved.' : 'Session saved as a draft.');
    setSaving(false);
  };

  if (loading) return <StudioPage><LoadingState label="Loading sessions…" /></StudioPage>;
  if (error && !sessions.length && !form.title) return <StudioPage><ErrorState message={error} /></StudioPage>;

  return (
    <StudioPage className="studio-management-page">
      <StudioPageHeader kicker="EVENTS & ATTENDANCE" title={<>Make the next<br /><em>room.</em></>} description="Write the session once, then let the public site, registration flow, and attendance record share the same source of truth." action={canManageSessions ? <button className="studio-primary-button" type="button" onClick={startNew}>Create a session <ArrowRight size={15} /></button> : <span className="studio-permission-note">Read-only view · {roleLabel}</span>} />
      <div className="studio-mini-stats"><span><strong>{counts.total}</strong> total records</span><span><strong>{counts.live}</strong> open</span><span><strong>{counts.drafts}</strong> drafts</span><span><strong>{counts.past}</strong> completed</span></div>
      <div className="studio-management-grid">
        <section className="studio-entity-list" aria-label="Session records">{sessions.length ? sessions.map((session) => <button type="button" className={`studio-entity-row${session.id === selectedId ? ' is-selected' : ''}`} key={session.id} onClick={() => selectSession(session)}><span className="studio-entity-date">{session.starts_at ? new Intl.DateTimeFormat('en-GH', { month: 'short', day: 'numeric' }).format(new Date(session.starts_at)) : 'TBD'}</span><span><strong>{session.title}</strong><small>{session.category || session.field || 'Session'} · {session.format.replace('_', ' ')}</small></span><span className="studio-entity-state"><StatusBadge status={session.is_public ? session.status : 'draft'} /></span><ArrowRight size={14} /></button>) : <EmptyState title="No sessions yet." description="Create a draft for the next useful conversation." action={canManageSessions ? <button className="studio-secondary-button" type="button" onClick={startNew}>Create the first session</button> : null} />}</section>
        <section className={`studio-editor-card${isReadOnly ? ' studio-editor-card--readonly' : ''}`} aria-labelledby="studio-session-editor-title">
          <div className="studio-editor-head"><div><span className="studio-panel-kicker">{form.id ? 'EDIT SESSION' : 'NEW SESSION'}</span><h2 id="studio-session-editor-title">{form.id ? form.title : 'Give the conversation a shape.'}</h2></div><a className="studio-inline-action" href="/journal" target="_blank" rel="noreferrer">See public journal <ArrowRight size={14} /></a></div>
          <div className="studio-save-state" role="status"><span className={saving ? 'is-saving' : isDirty ? 'is-unsaved' : 'is-saved'}>{saving ? 'Saving…' : isDirty ? 'Unsaved changes' : lastSavedAt ? `Saved at ${formatStudioSaveTime(lastSavedAt)}` : 'Not saved yet'}</span><span>{isReadOnly ? 'You can view records, but your role cannot change them.' : 'Save deliberately before leaving this record.'}</span></div>
          <form className="studio-editor-form" onSubmit={save}>
            <div className="studio-form-grid"><label>Session title<input aria-invalid={Boolean(fieldErrors.title)} aria-describedby={fieldErrors.title ? 'session-title-error' : undefined} disabled={isReadOnly} value={form.title} onChange={updateField('title')} placeholder="What should people leave knowing?" />{fieldErrors.title && <FieldError id="session-title-error">{fieldErrors.title}</FieldError>}</label><label>URL slug<span className="studio-field-help">Leave blank to generate it from the title.</span><input disabled={isReadOnly} value={form.slug} onChange={updateField('slug')} placeholder="career-conversations" /></label><label>Category<input disabled={isReadOnly} value={form.category} onChange={updateField('category')} placeholder="CAREER TALK" /></label><label>Field<input disabled={isReadOnly} value={form.field} onChange={updateField('field')} placeholder="Medicine, Law, Engineering…" /></label></div>
            <label>Short summary<span className="studio-field-help">The public-facing description used in the session card.</span><textarea aria-invalid={Boolean(fieldErrors.summary)} aria-describedby={fieldErrors.summary ? 'session-summary-error' : undefined} disabled={isReadOnly} rows="4" value={form.summary} onChange={updateField('summary')} placeholder="What will the room make possible?" />{fieldErrors.summary && <FieldError id="session-summary-error">{fieldErrors.summary}</FieldError>}</label>
            <div className="studio-form-grid"><label>Format<select disabled={isReadOnly} value={form.format} onChange={updateField('format')}><option value="online">Online</option><option value="in_person">In person</option><option value="hybrid">Hybrid</option></select></label><label>Venue / link label<input disabled={isReadOnly} value={form.venue} onChange={updateField('venue')} placeholder="University of Ghana · Legon" /></label><label>Starts<input aria-invalid={Boolean(fieldErrors.starts_at)} aria-describedby={fieldErrors.starts_at ? 'session-start-error' : undefined} disabled={isReadOnly} type="datetime-local" value={form.starts_at} onChange={updateField('starts_at')} />{fieldErrors.starts_at && <FieldError id="session-start-error">{fieldErrors.starts_at}</FieldError>}</label><label>Ends<input aria-invalid={Boolean(fieldErrors.ends_at)} aria-describedby={fieldErrors.ends_at ? 'session-end-error' : undefined} disabled={isReadOnly} type="datetime-local" value={form.ends_at} onChange={updateField('ends_at')} />{fieldErrors.ends_at && <FieldError id="session-end-error">{fieldErrors.ends_at}</FieldError>}</label></div>
            <div className="studio-form-grid"><label>Capacity<input aria-invalid={Boolean(fieldErrors.capacity)} aria-describedby={fieldErrors.capacity ? 'session-capacity-error' : undefined} disabled={isReadOnly} type="number" min="1" value={form.capacity} onChange={updateField('capacity')} placeholder="Optional" />{fieldErrors.capacity && <FieldError id="session-capacity-error">{fieldErrors.capacity}</FieldError>}</label><label>Duration / minutes<input aria-invalid={Boolean(fieldErrors.duration_minutes)} aria-describedby={fieldErrors.duration_minutes ? 'session-duration-error' : undefined} disabled={isReadOnly} type="number" min="1" value={form.duration_minutes} onChange={updateField('duration_minutes')} placeholder="90" />{fieldErrors.duration_minutes && <FieldError id="session-duration-error">{fieldErrors.duration_minutes}</FieldError>}</label><label>Attendees so far<input aria-invalid={Boolean(fieldErrors.attendee_count)} aria-describedby={fieldErrors.attendee_count ? 'session-attendees-error' : undefined} disabled={isReadOnly} type="number" min="0" value={form.attendee_count} onChange={updateField('attendee_count')} placeholder="0" />{fieldErrors.attendee_count && <FieldError id="session-attendees-error">{fieldErrors.attendee_count}</FieldError>}</label><label>Status<select disabled={isReadOnly} value={form.status} onChange={updateField('status')}><option value="draft">Draft</option><option value="open">Open for registration</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></label></div>
            <label className="studio-check"><input disabled={isReadOnly} type="checkbox" checked={form.is_public} onChange={updateField('is_public')} /> <span><strong>Publish to the public site</strong><small>Keep this off while details are still being confirmed.</small></span></label>
            <p className={`studio-visibility-summary${fieldErrors.visibility ? ' has-warning' : ''}`} aria-live="polite">{getVisibilityMessage(form)}</p>
            {fieldErrors.visibility && <FieldError id="session-visibility-error">{fieldErrors.visibility}</FieldError>}
            {error && <p className="studio-inline-error" role="alert">{error}</p>}{notice && <p className="studio-inline-notice" role="status">{notice}</p>}
            <div className="studio-editor-actions">{canManageSessions ? <button className="studio-primary-button" type="submit" disabled={saving}>{saving ? 'Saving…' : form.id ? 'Save session' : 'Save as draft'} <ArrowRight size={15} /></button> : <span className="studio-readonly-lock">Read-only access · no changes can be saved</span>}{canManageSessions && form.id && <button className="studio-quiet-button" type="button" onClick={startNew}>Clear editor</button>}</div>
          </form>
        </section>
      </div>
    </StudioPage>
  );
}
