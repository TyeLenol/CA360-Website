'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from '../shared/Icons';
import { createSupabaseBrowserClient } from '../../lib/supabase/client';
import { EmptyState, ErrorState, formatStudioDate, LoadingState, normalizeSlug, StatusBadge, StudioPage, StudioPageHeader } from './StudioShared';

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

export function StudioSessions() {
  const [sessions, setSessions] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = async () => {
    setLoading(true);
    const { data, error: loadError } = await supabase.from('sessions').select('id, title, slug, summary, field, format, venue, starts_at, ends_at, capacity, category, duration_minutes, attendee_count, status, is_public, updated_at').order('starts_at', { ascending: false, nullsFirst: false }).limit(100);
    if (loadError) setError('Sessions could not be loaded. Check your Studio access and try again.');
    const rows = data || [];
    setSessions(rows);
    setSelectedId((current) => current || rows[0]?.id || '');
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const selected = sessions.find((session) => session.id === selectedId);
  useEffect(() => {
    if (selected) setForm({ ...selected, starts_at: toInputDateTime(selected.starts_at), ends_at: toInputDateTime(selected.ends_at), capacity: selected.capacity ?? '', duration_minutes: selected.duration_minutes ?? '', attendee_count: selected.attendee_count ?? '' });
  }, [selectedId]);

  const counts = useMemo(() => ({ total: sessions.length, live: sessions.filter((session) => session.status === 'open').length, drafts: sessions.filter((session) => session.status === 'draft').length, past: sessions.filter((session) => session.status === 'completed').length }), [sessions]);

  const updateField = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const updateCheckbox = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.checked }));
  const startNew = () => { setSelectedId(''); setForm(EMPTY_FORM); setError(''); setNotice(''); };

  const save = async (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.summary.trim()) {
      setError('Add a title and short summary before saving the session.');
      return;
    }
    if (form.starts_at && form.ends_at && new Date(form.ends_at) <= new Date(form.starts_at)) {
      setError('The end time must be after the start time.');
      return;
    }
    setSaving(true);
    setError('');
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
    const result = form.id ? await supabase.from('sessions').update(payload).eq('id', form.id).select('id, title, slug, summary, field, format, venue, starts_at, ends_at, capacity, category, duration_minutes, attendee_count, status, is_public, updated_at').single() : await supabase.from('sessions').insert(payload).select('id, title, slug, summary, field, format, venue, starts_at, ends_at, capacity, category, duration_minutes, attendee_count, status, is_public, updated_at').single();
    if (result.error) {
      setError(result.error.code === '23505' ? 'That session slug is already in use.' : 'Session could not be saved. Check your role and the fields above.');
      setSaving(false);
      return;
    }
    const session = result.data;
    setSessions((current) => form.id ? current.map((item) => item.id === session.id ? session : item) : [session, ...current]);
    setSelectedId(session.id);
    setForm({ ...session, starts_at: toInputDateTime(session.starts_at), ends_at: toInputDateTime(session.ends_at), capacity: session.capacity ?? '', duration_minutes: session.duration_minutes ?? '', attendee_count: session.attendee_count ?? '' });
    setNotice(form.id ? 'Session saved.' : 'Session saved as a draft.');
    setSaving(false);
  };

  if (loading) return <StudioPage><LoadingState label="Loading sessions…" /></StudioPage>;
  if (error && !sessions.length && !form.title) return <StudioPage><ErrorState message={error} /></StudioPage>;

  return (
    <StudioPage className="studio-management-page">
      <StudioPageHeader kicker="EVENTS & ATTENDANCE" title={<>Make the next<br /><em>room.</em></>} description="Write the session once, then let the public site, registration flow, and attendance record share the same source of truth." action={<button className="studio-primary-button" type="button" onClick={startNew}>Create a session <ArrowRight size={15} /></button>} />
      <div className="studio-mini-stats"><span><strong>{counts.total}</strong> total records</span><span><strong>{counts.live}</strong> open</span><span><strong>{counts.drafts}</strong> drafts</span><span><strong>{counts.past}</strong> completed</span></div>
      <div className="studio-management-grid">
        <section className="studio-entity-list" aria-label="Session records">{sessions.length ? sessions.map((session) => <button type="button" className={`studio-entity-row${session.id === selectedId ? ' is-selected' : ''}`} key={session.id} onClick={() => { setSelectedId(session.id); setError(''); setNotice(''); }}><span className="studio-entity-date">{session.starts_at ? new Intl.DateTimeFormat('en-GH', { month: 'short', day: 'numeric' }).format(new Date(session.starts_at)) : 'TBD'}</span><span><strong>{session.title}</strong><small>{session.category || session.field || 'Session'} · {session.format.replace('_', ' ')}</small></span><span className="studio-entity-state"><StatusBadge status={session.is_public ? session.status : 'draft'} /></span><ArrowRight size={14} /></button>) : <EmptyState title="No sessions yet." description="Create a draft for the next useful conversation." action={<button className="studio-secondary-button" type="button" onClick={startNew}>Create the first session</button>} />}</section>
        <section className="studio-editor-card" aria-labelledby="studio-session-editor-title">
          <div className="studio-editor-head"><div><span className="studio-panel-kicker">{form.id ? 'EDIT SESSION' : 'NEW SESSION'}</span><h2 id="studio-session-editor-title">{form.id ? form.title : 'Give the conversation a shape.'}</h2></div><a className="studio-inline-action" href="/journal" target="_blank" rel="noreferrer">See public journal <ArrowRight size={14} /></a></div>
          <form className="studio-editor-form" onSubmit={save}>
            <div className="studio-form-grid"><label>Session title<input value={form.title} onChange={updateField('title')} placeholder="What should people leave knowing?" /></label><label>URL slug<input value={form.slug} onChange={updateField('slug')} placeholder="career-conversations" /></label><label>Category<input value={form.category} onChange={updateField('category')} placeholder="CAREER TALK" /></label><label>Field<input value={form.field} onChange={updateField('field')} placeholder="Medicine, Law, Engineering…" /></label></div>
            <label>Short summary<span className="studio-field-help">The public-facing description used in the session card.</span><textarea rows="4" value={form.summary} onChange={updateField('summary')} placeholder="What will the room make possible?" /></label>
            <div className="studio-form-grid"><label>Format<select value={form.format} onChange={updateField('format')}><option value="online">Online</option><option value="in_person">In person</option><option value="hybrid">Hybrid</option></select></label><label>Venue / link label<input value={form.venue} onChange={updateField('venue')} placeholder="University of Ghana · Legon" /></label><label>Starts<input type="datetime-local" value={form.starts_at} onChange={updateField('starts_at')} /></label><label>Ends<input type="datetime-local" value={form.ends_at} onChange={updateField('ends_at')} /></label></div>
            <div className="studio-form-grid"><label>Capacity<input type="number" min="1" value={form.capacity} onChange={updateField('capacity')} placeholder="Optional" /></label><label>Duration / minutes<input type="number" min="1" value={form.duration_minutes} onChange={updateField('duration_minutes')} placeholder="90" /></label><label>Attendees so far<input type="number" min="0" value={form.attendee_count} onChange={updateField('attendee_count')} placeholder="0" /></label><label>Status<select value={form.status} onChange={updateField('status')}><option value="draft">Draft</option><option value="open">Open for registration</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></label></div>
            <label className="studio-check"><input type="checkbox" checked={form.is_public} onChange={updateCheckbox('is_public')} /> <span><strong>Publish to the public site</strong><small>Keep this off while details are still being confirmed.</small></span></label>
            {error && <p className="studio-inline-error" role="alert">{error}</p>}{notice && <p className="studio-inline-notice" role="status">{notice}</p>}
            <div className="studio-editor-actions"><button className="studio-primary-button" type="submit" disabled={saving}>{saving ? 'Saving…' : form.id ? 'Save session' : 'Save as draft'} <ArrowRight size={15} /></button>{form.id && <button className="studio-quiet-button" type="button" onClick={startNew}>Clear editor</button>}</div>
          </form>
        </section>
      </div>
    </StudioPage>
  );
}
