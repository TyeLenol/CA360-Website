'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from '../shared/Icons';
import { createSupabaseBrowserClient } from '../../lib/supabase/client';
import { EmptyState, ErrorState, LoadingState, normalizeSlug, StatusBadge, StudioPage, StudioPageHeader } from './StudioShared';

const supabase = createSupabaseBrowserClient();
const EMPTY_FORM = {
  id: '',
  name: '',
  slug: '',
  role_label: '',
  field: '',
  positioning: '',
  path_summary: '',
  quote: '',
  avatar_label: '',
  specialties: '',
  status: 'application_only',
  is_public: false,
  accepting_requests: false,
};

export function StudioMentors() {
  const [mentors, setMentors] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = async () => {
    setLoading(true);
    const { data, error: loadError } = await supabase.from('mentors').select('id, name, slug, role_label, field, positioning, path_summary, quote, avatar_label, status, is_public, accepting_requests, updated_at').order('updated_at', { ascending: false }).limit(100);
    if (loadError) setError('Mentors could not be loaded. Check your Studio access and try again.');
    const rows = data || [];
    setMentors(rows);
    setSelectedId((current) => current || rows[0]?.id || '');
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const selected = mentors.find((mentor) => mentor.id === selectedId);
  useEffect(() => {
    if (!selected) return;
    let active = true;
    supabase.from('mentor_specialties').select('specialty').eq('mentor_id', selected.id).order('specialty', { ascending: true }).limit(30).then(({ data }) => {
      if (active) setForm({ ...selected, specialties: (data || []).map((row) => row.specialty).join(', ') });
    });
    return () => { active = false; };
  }, [selectedId]);

  const statusCounts = useMemo(() => ({ all: mentors.length, public: mentors.filter((mentor) => mentor.is_public).length, drafts: mentors.filter((mentor) => !mentor.is_public).length }), [mentors]);

  const selectMentor = (mentor) => {
    setSelectedId(mentor.id);
    setError('');
    setNotice('');
  };

  const startNew = () => {
    setSelectedId('');
    setForm(EMPTY_FORM);
    setError('');
    setNotice('');
  };

  const updateField = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }));

  const save = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.role_label.trim() || !form.field.trim() || !form.positioning.trim() || !form.path_summary.trim()) {
      setError('Add the name, role, field, positioning, and path summary before saving.');
      return;
    }
    setSaving(true);
    setError('');
    const payload = {
      name: form.name.trim(),
      slug: normalizeSlug(form.slug || form.name),
      role_label: form.role_label.trim(),
      field: form.field.trim(),
      positioning: form.positioning.trim(),
      path_summary: form.path_summary.trim(),
      quote: form.quote.trim() || null,
      avatar_label: form.avatar_label.trim() || `MENTOR · ${form.field.trim().toUpperCase()}`,
      status: form.status,
      is_public: form.is_public,
      accepting_requests: form.accepting_requests,
    };
    const result = form.id ? await supabase.from('mentors').update(payload).eq('id', form.id).select('id, name, slug, role_label, field, positioning, path_summary, quote, avatar_label, status, is_public, accepting_requests, updated_at').single() : await supabase.from('mentors').insert(payload).select('id, name, slug, role_label, field, positioning, path_summary, quote, avatar_label, status, is_public, accepting_requests, updated_at').single();
    if (result.error) {
      setError(result.error.code === '23505' ? 'That slug is already in use. Choose a different one.' : 'Mentor could not be saved. Check your role and try again.');
      setSaving(false);
      return;
    }
    const mentor = result.data;
    await supabase.from('mentor_specialties').delete().eq('mentor_id', mentor.id);
    const specialties = form.specialties.split(',').map((item) => item.trim()).filter(Boolean);
    if (specialties.length) await supabase.from('mentor_specialties').insert(specialties.map((specialty) => ({ mentor_id: mentor.id, specialty })));
    setMentors((current) => form.id ? current.map((item) => item.id === mentor.id ? mentor : item) : [mentor, ...current]);
    setSelectedId(mentor.id);
    setForm({ ...mentor, specialties: specialties.join(', ') });
    setNotice(form.id ? 'Mentor profile saved.' : 'Mentor added as a draft.');
    setSaving(false);
  };

  if (loading) return <StudioPage><LoadingState label="Loading mentors…" /></StudioPage>;
  if (error && !mentors.length && !form.name) return <StudioPage><ErrorState message={error} /></StudioPage>;

  return (
    <StudioPage className="studio-management-page">
      <StudioPageHeader kicker="PEOPLE & SPECIALTIES" title={<>Care for the<br /><em>people.</em></>} description="Keep each profile honest, useful, and easy for a student to understand. Publishing is always an explicit choice." action={<button className="studio-primary-button" type="button" onClick={startNew}>Add a mentor <ArrowRight size={15} /></button>} />
      <div className="studio-mini-stats"><span><strong>{statusCounts.all}</strong> total profiles</span><span><strong>{statusCounts.public}</strong> public</span><span><strong>{statusCounts.drafts}</strong> drafts / hidden</span></div>
      <div className="studio-management-grid">
        <section className="studio-entity-list" aria-label="Mentor profiles">{mentors.length ? mentors.map((mentor) => <button type="button" className={`studio-entity-row${mentor.id === selectedId ? ' is-selected' : ''}`} key={mentor.id} onClick={() => selectMentor(mentor)}><span className="studio-entity-initial">{mentor.name.slice(0, 1)}</span><span><strong>{mentor.name}</strong><small>{mentor.field} · {mentor.role_label}</small></span><span className="studio-entity-state"><StatusBadge status={mentor.is_public ? 'published' : 'draft'} /></span><ArrowRight size={14} /></button>) : <EmptyState title="No mentor profiles yet." description="Add the first person whose lived experience should be visible to students." action={<button className="studio-secondary-button" type="button" onClick={startNew}>Add the first mentor</button>} />}</section>
        <section className="studio-editor-card" aria-labelledby="studio-mentor-editor-title">
          <div className="studio-editor-head"><div><span className="studio-panel-kicker">{form.id ? 'EDIT PROFILE' : 'NEW PROFILE'}</span><h2 id="studio-mentor-editor-title">{form.id ? form.name : 'A new person, carefully.'}</h2></div>{form.id && <a className="studio-inline-action" href={`/mentorship/${form.slug}`} target="_blank" rel="noreferrer">Preview profile <ArrowRight size={14} /></a>}</div>
          <form className="studio-editor-form" onSubmit={save}>
            <div className="studio-form-grid"><label>Full name<input value={form.name} onChange={updateField('name')} placeholder="e.g. Dr. A. Asare" /></label><label>URL slug<input value={form.slug} onChange={updateField('slug')} placeholder="dr-a-asare" /></label><label>Role / current place<input value={form.role_label} onChange={updateField('role_label')} placeholder="Founder & Lead Mentor" /></label><label>Field<input value={form.field} onChange={updateField('field')} placeholder="Medicine" /></label></div>
            <label>Positioning sentence<span className="studio-field-help">The short line that helps a student decide if this person fits.</span><textarea rows="3" value={form.positioning} onChange={updateField('positioning')} placeholder="For the student who…" /></label>
            <label>The honest path<span className="studio-field-help">A paragraph about the route, turns, and reality behind the role.</span><textarea rows="5" value={form.path_summary} onChange={updateField('path_summary')} placeholder="Tell the lived version of the path…" /></label>
            <div className="studio-form-grid"><label>Specialties<span className="studio-field-help">Separate with commas.</span><input value={form.specialties} onChange={updateField('specialties')} placeholder="Medicine, study systems" /></label><label>Profile label<span className="studio-field-help">Used by the abstract portrait system until media is approved.</span><input value={form.avatar_label} onChange={updateField('avatar_label')} placeholder="MENTOR · MEDICINE" /></label></div>
            <label>Quote <textarea rows="3" value={form.quote} onChange={updateField('quote')} placeholder="A line worth carrying forward…" /></label>
            <div className="studio-editor-controls"><label>Status<select value={form.status} onChange={updateField('status')}><option value="application_only">Application only</option><option value="active">Active</option><option value="paused">Paused</option></select></label><label className="studio-check"><input type="checkbox" checked={form.is_public} onChange={updateField('is_public')} /> <span><strong>Show on public mentor index</strong><small>Keep off while this profile is being reviewed.</small></span></label><label className="studio-check"><input type="checkbox" checked={form.accepting_requests} onChange={updateField('accepting_requests')} /> <span><strong>Accepting introductions</strong><small>Allow this person to be selected for new requests.</small></span></label></div>
            {error && <p className="studio-inline-error" role="alert">{error}</p>}{notice && <p className="studio-inline-notice" role="status">{notice}</p>}
            <div className="studio-editor-actions"><button className="studio-primary-button" type="submit" disabled={saving}>{saving ? 'Saving…' : form.id ? 'Save profile' : 'Save as draft'} <ArrowRight size={15} /></button>{form.id && <button className="studio-quiet-button" type="button" onClick={startNew}>Clear editor</button>}</div>
          </form>
        </section>
      </div>
    </StudioPage>
  );
}
