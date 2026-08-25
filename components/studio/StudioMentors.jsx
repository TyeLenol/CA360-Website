'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from '../shared/Icons';
import { createSupabaseBrowserClient } from '../../lib/supabase/client';
import { revalidatePublicContent } from '../../lib/studio/revalidate';
import { EmptyState, ErrorState, FieldError, formatStudioSaveTime, LoadingState, normalizeSlug, StatusBadge, StudioPage, StudioPageHeader } from './StudioShared';
import { useStudioPermissions } from './StudioPermissions';

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
  image_url: '',
  specialties: '',
  status: 'application_only',
  is_public: false,
  accepting_requests: false,
};

const COMMON_FIELDS = ['Medicine', 'Law', 'Engineering', 'Technology', 'Business', 'Public Health', 'Education', 'Research', 'Finance', 'Creative Arts'];
const COMMON_ROLES = ['Founder & Lead Mentor', 'Medical Student', 'House Officer', 'Resident Doctor', 'Law Student', 'Engineer', 'Researcher', 'Entrepreneur', 'Teacher / Educator'];
const COMMON_SPECIALTIES = ['Study systems', 'Medical school', 'Career direction', 'Exam preparation', 'Applications', 'Public speaking', 'Research pathways', 'Interview preparation', 'Entrepreneurship', 'Work-life balance'];

function getVisibilityMessage(form) {
  if (!form.is_public) return 'Draft / private — this mentor is not visible on the public site.';
  if (form.status === 'application_only') return 'Needs attention — an application-only mentor should stay private until the profile is ready.';
  return `Published — visible on the public site${form.accepting_requests ? ' and open to introductions.' : '; introductions are currently closed.'}`;
}

function cloneForm(form) {
  return { ...form };
}

export function StudioMentors() {
  const { canManageMentors, roleLabel } = useStudioPermissions();
  const mentorReadOnly = !canManageMentors;
  const [mentors, setMentors] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [savedForm, setSavedForm] = useState(EMPTY_FORM);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [localImagePreview, setLocalImagePreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const imageSrc = localImagePreview || form.image_url;
  const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(savedForm) || Boolean(imageFile), [form, savedForm, imageFile]);

  const load = async () => {
    if (!supabase) {
      setError('Supabase is not configured for this deployment. Add the public Supabase variables in Vercel and redeploy.');
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error: loadError } = await supabase.from('mentors').select('id, name, slug, role_label, field, positioning, path_summary, quote, avatar_label, image_url, status, is_public, accepting_requests, updated_at').order('updated_at', { ascending: false }).limit(100);
    if (loadError) setError('Mentors could not be loaded. Check your Studio access and try again.');
    const rows = data || [];
    setMentors(rows);
    setSelectedId((current) => current || rows[0]?.id || '');
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    return () => {
      if (localImagePreview) URL.revokeObjectURL(localImagePreview);
    };
  }, [localImagePreview]);

  const selected = mentors.find((mentor) => mentor.id === selectedId);
  useEffect(() => {
    if (!supabase) return undefined;
    if (!selected) {
      if (!selectedId) {
        setForm(EMPTY_FORM);
        setSavedForm(EMPTY_FORM);
      }
      return undefined;
    }

    let active = true;
    supabase.from('mentor_specialties').select('specialty').eq('mentor_id', selected.id).order('specialty', { ascending: true }).limit(30).then(({ data }) => {
      if (!active) return;
      const nextForm = { ...selected, specialties: (data || []).map((row) => row.specialty).join(', ') };
      setForm(nextForm);
      setSavedForm(cloneForm(nextForm));
      setLastSavedAt(selected.updated_at || null);
      setFieldErrors({});
      setImageFile(null);
      setLocalImagePreview('');
    });
    return () => { active = false; };
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

  const statusCounts = useMemo(() => ({
    all: mentors.length,
    public: mentors.filter((mentor) => mentor.is_public).length,
    drafts: mentors.filter((mentor) => !mentor.is_public).length,
  }), [mentors]);

  const confirmDiscard = () => !isDirty || window.confirm('You have unsaved mentor changes. Discard them?');

  const selectMentor = (mentor) => {
    if (!confirmDiscard()) return;
    setSelectedId(mentor.id);
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
      setImageFile(null);
    setLocalImagePreview('');
    setError('');
    setNotice('');
  };

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }));
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
    if (!form.name.trim()) nextErrors.name = 'Enter the mentor’s full name.';
    if (!form.role_label.trim()) nextErrors.role_label = 'Add the mentor’s role or current place.';
    if (!form.field.trim()) nextErrors.field = 'Choose or enter a field.';
    if (!form.positioning.trim()) nextErrors.positioning = 'Add one clear reason this mentor may be useful.';
    if (!form.path_summary.trim()) nextErrors.path_summary = 'Add the lived path before saving the profile.';
    if (form.is_public && form.status === 'application_only') nextErrors.visibility = 'Choose Active or Paused before publishing. Application-only profiles should stay private.';
    setFieldErrors(nextErrors);
    return nextErrors;
  };

  const chooseFieldPreset = (event) => {
    const value = event.target.value;
    setForm((current) => ({ ...current, field: value === '__custom' ? '' : value }));
  };

  const chooseImage = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Use a JPG, PNG, or WebP image.');
      return;
    }
    if (file.size > 6 * 1024 * 1024) {
      setError('Keep mentor images under 6MB for a reliable upload.');
      return;
    }
    setError('');
    setNotice('Photo selected. Save the profile to upload it securely.');
    setImageFile(file);
    setLocalImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setLocalImagePreview('');
    setForm((current) => ({ ...current, image_url: '' }));
    setNotice('Photo removed from this draft. Save to remove it from the public profile.');
  };

  const save = async (event) => {
    event.preventDefault();
    if (!canManageMentors) {
      setError('Your Studio role is read-only for mentor records. Ask an admin for editing access.');
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
    const specialties = form.specialties.split(',').map((item) => item.trim()).filter(Boolean);
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
    if (!imageFile) payload.image_url = form.image_url.trim() || null;

    const columns = 'id, name, slug, role_label, field, positioning, path_summary, quote, avatar_label, image_url, status, is_public, accepting_requests, updated_at';
    const result = form.id
      ? await supabase.from('mentors').update(payload).eq('id', form.id).select(columns).single()
      : await supabase.from('mentors').insert(payload).select(columns).single();

    if (result.error) {
      setError(result.error.code === '23505' ? 'That slug is already in use. Choose a different one.' : 'Mentor could not be saved. Check your role and try again.');
      setSaving(false);
      return;
    }

    let mentor = result.data;
    let uploadMessage = '';
    if (imageFile) {
      const extension = imageFile.name.split('.').pop()?.toLowerCase() || 'jpg';
      const token = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const path = `mentors/${mentor.id}/${token}.${extension}`;
      const upload = await supabase.storage.from('mentor-images').upload(path, imageFile, {
        cacheControl: '31536000',
        contentType: imageFile.type,
        upsert: false,
      });
      if (upload.error) {
        uploadMessage = ' Profile saved, but the photo could not be uploaded; try the photo again.';
      } else {
        const publicUrl = supabase.storage.from('mentor-images').getPublicUrl(path).data.publicUrl;
        const imageUpdate = await supabase.from('mentors').update({ image_url: publicUrl }).eq('id', mentor.id).select(columns).single();
        if (imageUpdate.error) uploadMessage = ' Profile saved, but the photo link could not be saved; try the photo again.';
        else mentor = imageUpdate.data;
      }
    }

    const specialtyDelete = await supabase.from('mentor_specialties').delete().eq('mentor_id', mentor.id);
    const specialtyInsert = specialties.length
      ? await supabase.from('mentor_specialties').insert(specialties.map((specialty) => ({ mentor_id: mentor.id, specialty })))
      : { error: null };
    const specialtyError = specialtyDelete.error || specialtyInsert.error;

    void revalidatePublicContent();
    setMentors((current) => form.id ? current.map((item) => item.id === mentor.id ? mentor : item) : [mentor, ...current]);
    setSelectedId(mentor.id);
    const nextForm = { ...mentor, specialties: specialties.join(', ') };
    setForm(nextForm);
    setSavedForm(cloneForm(nextForm));
    setLastSavedAt(mentor.updated_at || new Date().toISOString());
    setFieldErrors({});
    setImageFile(null);
    setLocalImagePreview('');
    setNotice(`${form.id ? 'Mentor profile saved.' : 'Mentor added as a draft.'}${specialtyError ? ' Profile saved, but specialties could not be updated.' : ''}${uploadMessage}`);
    setSaving(false);
  };

  if (loading) return <StudioPage><LoadingState label="Loading mentors…" /></StudioPage>;
  if (error && !mentors.length && !form.name) return <StudioPage><ErrorState message={error} /></StudioPage>;

  const fieldIsPreset = COMMON_FIELDS.includes(form.field);
  const fieldSelectValue = form.field ? (fieldIsPreset ? form.field : '__custom') : '';

  return (
    <StudioPage className="studio-management-page">
      <StudioPageHeader kicker="PEOPLE & SPECIALTIES" title={<>Care for the<br /><em>people.</em></>} description="Keep each profile honest, useful, and easy for a student to understand. Publishing is always an explicit choice." action={canManageMentors ? <button className="studio-primary-button" type="button" onClick={startNew}>Add a mentor <ArrowRight size={15} /></button> : <span className="studio-permission-note">Read-only view · {roleLabel}</span>} />
      <div className="studio-mini-stats"><span><strong>{statusCounts.all}</strong> total profiles</span><span><strong>{statusCounts.public}</strong> public</span><span><strong>{statusCounts.drafts}</strong> drafts / hidden</span></div>
      <div className="studio-management-grid studio-management-grid--mentors">
        <section className="studio-entity-list" aria-label="Mentor profiles">{mentors.length ? mentors.map((mentor) => <button type="button" className={`studio-entity-row${mentor.id === selectedId ? ' is-selected' : ''}`} key={mentor.id} onClick={() => selectMentor(mentor)}><span className="studio-entity-initial studio-entity-initial--photo">{mentor.image_url ? <img src={mentor.image_url} alt="" /> : mentor.name.slice(0, 1)}</span><span><strong>{mentor.name}</strong><small>{mentor.field} · {mentor.role_label}</small></span><span className="studio-entity-state"><StatusBadge status={mentor.is_public ? 'published' : 'draft'} /></span><ArrowRight size={14} /></button>) : <EmptyState title="No mentor profiles yet." description="Add the first person whose lived experience should be visible to students." action={canManageMentors ? <button className="studio-secondary-button" type="button" onClick={startNew}>Add the first mentor</button> : null} />}</section>
        <section className={`studio-editor-card studio-mentor-editor-card${mentorReadOnly ? ' studio-editor-card--readonly' : ''}`} aria-labelledby="studio-mentor-editor-title">
          <div className="studio-editor-head"><div><span className="studio-panel-kicker">{form.id ? 'EDIT PROFILE' : 'NEW PROFILE'}</span><h2 id="studio-mentor-editor-title">{form.id ? form.name : 'A new person, carefully.'}</h2></div>{form.id && <a className="studio-inline-action" href={`/mentorship/${form.slug}`} target="_blank" rel="noreferrer">Open live profile <ArrowRight size={14} /></a>}</div>
          <div className="studio-save-state" role="status"><span className={saving ? 'is-saving' : isDirty ? 'is-unsaved' : 'is-saved'}>{saving ? 'Saving…' : isDirty ? 'Unsaved changes' : lastSavedAt ? `Saved at ${formatStudioSaveTime(lastSavedAt)}` : 'Not saved yet'}</span><span>{mentorReadOnly ? 'You can view records, but your role cannot change them.' : 'Save deliberately before leaving this record.'}</span></div>
          <form className="studio-editor-form" onSubmit={save}>
              <section className="studio-editor-section">
                <div className="studio-editor-section-head"><span>01 / Identity</span><p>Make it easy to understand who this person is at a glance.</p></div>
                <div className="studio-form-grid"><label>Full name<span className="studio-required">Required</span><input aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? 'mentor-name-error' : undefined} disabled={mentorReadOnly} value={form.name} onChange={updateField('name')} placeholder="e.g. Dr. A. Asare" autoComplete="name" />{fieldErrors.name && <FieldError id="mentor-name-error">{fieldErrors.name}</FieldError>}</label><label>URL slug<span className="studio-field-help">Leave blank to generate it from the name.</span><input disabled={mentorReadOnly} value={form.slug} onChange={updateField('slug')} placeholder="dr-a-asare" /></label><label>Role / current place<span className="studio-field-example">Example: Founder &amp; Lead Mentor · Korle Bu</span><input aria-invalid={Boolean(fieldErrors.role_label)} aria-describedby={fieldErrors.role_label ? 'mentor-role-error' : undefined} disabled={mentorReadOnly} list="mentor-role-suggestions" value={form.role_label} onChange={updateField('role_label')} placeholder="Founder & Lead Mentor" />{fieldErrors.role_label && <FieldError id="mentor-role-error">{fieldErrors.role_label}</FieldError>}<datalist id="mentor-role-suggestions">{COMMON_ROLES.map((role) => <option value={role} key={role} />)}</datalist></label><label>Field<span className="studio-field-help">Choose a common field or use Other for a custom one.</span><select aria-invalid={Boolean(fieldErrors.field)} aria-describedby={fieldErrors.field ? 'mentor-field-error' : undefined} disabled={mentorReadOnly} value={fieldSelectValue} onChange={chooseFieldPreset}><option value="">Choose a field</option>{COMMON_FIELDS.map((field) => <option value={field} key={field}>{field}</option>)}<option value="__custom">Other / custom field</option></select>{!fieldIsPreset && <input aria-invalid={Boolean(fieldErrors.field)} aria-describedby={fieldErrors.field ? 'mentor-field-error' : undefined} disabled={mentorReadOnly} value={form.field} onChange={updateField('field')} placeholder="e.g. Architecture" />}{fieldErrors.field && <FieldError id="mentor-field-error">{fieldErrors.field}</FieldError>}</label></div>
              </section>

              <section className="studio-editor-section">
                <div className="studio-editor-section-head"><span>02 / The useful story</span><p>Write for a student making a decision, not for a résumé.</p></div>
                <label>Positioning sentence<span className="studio-field-help">One clear reason this mentor may be the right starting point.</span><span className="studio-field-example">Example: For students weighing medicine and wanting the honest version of the route.</span><textarea aria-invalid={Boolean(fieldErrors.positioning)} aria-describedby={fieldErrors.positioning ? 'mentor-positioning-error' : undefined} disabled={mentorReadOnly} rows="3" value={form.positioning} onChange={updateField('positioning')} placeholder="For the student who…" />{fieldErrors.positioning && <FieldError id="mentor-positioning-error">{fieldErrors.positioning}</FieldError>}</label>
                <label>The honest path<span className="studio-field-help">Explain the route, turns, and reality behind the role in a human paragraph.</span><span className="studio-field-example">Example: I started with a very certain plan, then discovered that the day-to-day work mattered more than the title. The useful part was learning how to test the path before committing years to it.</span><textarea aria-invalid={Boolean(fieldErrors.path_summary)} aria-describedby={fieldErrors.path_summary ? 'mentor-path-error' : undefined} disabled={mentorReadOnly} rows="6" value={form.path_summary} onChange={updateField('path_summary')} placeholder="Tell the lived version of the path…" />{fieldErrors.path_summary && <FieldError id="mentor-path-error">{fieldErrors.path_summary}</FieldError>}</label>
                <label>Quote<span className="studio-field-help">A short line that sounds like the person, not a generic inspirational quote.</span><span className="studio-field-example">Example: You do not need the whole map before you take the next useful step.</span><textarea disabled={mentorReadOnly} rows="3" value={form.quote} onChange={updateField('quote')} placeholder="A line worth carrying forward…" /></label>
              </section>

              <section className="studio-editor-section">
                <div className="studio-editor-section-head"><span>03 / Fit &amp; discoverability</span><p>Use consistent tags so students can compare profiles without guesswork.</p></div>
                <label>Specialties<span className="studio-field-help">Separate with commas. Use the quick picks or type your own.</span><span className="studio-field-example">Example: Medical school, study systems, applications</span><input disabled={mentorReadOnly} list="mentor-specialty-suggestions" value={form.specialties} onChange={updateField('specialties')} placeholder="Medicine, study systems" /><datalist id="mentor-specialty-suggestions">{COMMON_SPECIALTIES.map((specialty) => <option value={specialty} key={specialty} />)}</datalist></label>
                <div className="studio-quick-picks" aria-label="Common specialty quick picks">{COMMON_SPECIALTIES.slice(0, 6).map((specialty) => <button disabled={mentorReadOnly} type="button" key={specialty} onClick={() => setForm((current) => ({ ...current, specialties: Array.from(new Set([...current.specialties.split(',').map((item) => item.trim()).filter(Boolean), specialty])).join(', ') }))}>{specialty} +</button>)}</div>
                <label>Fallback profile label<span className="studio-field-help">Used only when no photo is uploaded.</span><input disabled={mentorReadOnly} value={form.avatar_label} onChange={updateField('avatar_label')} placeholder="MENTOR · MEDICINE" /></label>
              </section>

              <section className="studio-editor-section studio-editor-media-section">
                <div className="studio-editor-section-head"><span>04 / Profile image</span><p>One clear, well-lit portrait makes the profile feel like a person rather than a record.</p></div>
                <div className="studio-image-upload"><div className="studio-image-upload-preview">{imageSrc ? <img src={imageSrc} alt="Selected mentor portrait preview" /> : <span>PHOTO<br />OPTIONAL</span>}</div><div className="studio-image-upload-copy"><label className="studio-upload-button">{imageSrc ? 'Replace portrait' : 'Choose portrait'}<input disabled={mentorReadOnly} type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseImage} /></label><p>JPG, PNG, or WebP. Keep it under 6MB. A new file path is used each time so the public CDN does not serve an old replacement.</p>{imageSrc && <button disabled={mentorReadOnly} type="button" className="studio-quiet-button studio-remove-image" onClick={removeImage}>Remove portrait</button>}</div></div>
              </section>

              <section className="studio-editor-section">
                <div className="studio-editor-section-head"><span>05 / Visibility</span><p>Save freely while drafting. Publishing stays deliberate.</p></div>
                <div className="studio-editor-controls"><label>Status<select disabled={mentorReadOnly} value={form.status} onChange={updateField('status')}><option value="application_only">Application only</option><option value="active">Active</option><option value="paused">Paused</option></select></label><label className="studio-check"><input disabled={mentorReadOnly} type="checkbox" checked={form.is_public} onChange={updateField('is_public')} /> <span><strong>Show on public mentor index</strong><small>Keep off while this profile is being reviewed.</small></span></label><label className="studio-check"><input disabled={mentorReadOnly} type="checkbox" checked={form.accepting_requests} onChange={updateField('accepting_requests')} /> <span><strong>Accepting introductions</strong><small>Allow this person to be selected for new requests.</small></span></label></div><p className={`studio-visibility-summary${fieldErrors.visibility ? ' has-warning' : ''}`} aria-live="polite">{getVisibilityMessage(form)}</p>{fieldErrors.visibility && <FieldError id="mentor-visibility-error">{fieldErrors.visibility}</FieldError>}
              </section>

              {error && <p className="studio-inline-error" role="alert">{error}</p>}{notice && <p className="studio-inline-notice" role="status">{notice}</p>}
              <div className="studio-editor-actions">{canManageMentors ? <button className="studio-primary-button" type="submit" disabled={saving}>{saving ? 'Saving…' : form.id ? 'Save profile' : 'Save as draft'} <ArrowRight size={15} /></button> : <span className="studio-readonly-lock">Read-only access · no changes can be saved</span>}{canManageMentors && form.id && <button className="studio-quiet-button" type="button" onClick={startNew}>Clear editor</button>}{isDirty && <span className="studio-unsaved-note">Unsaved changes</span>}</div>
          </form>
        </section>
      </div>
    </StudioPage>
  );
}
