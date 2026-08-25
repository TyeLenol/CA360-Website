'use client';

import { useEffect, useMemo, useState } from 'react';
import { createSupabaseBrowserClient } from '../../lib/supabase/client';
import { ArrowRight, PlusIcon } from '../shared/Icons';
import { EmptyState, ErrorState, FieldError, LoadingState, StatusBadge, StudioPage, StudioPageHeader, formatStudioSaveTime } from './StudioShared';
import { useStudioPermissions } from './StudioPermissions';

const EMPTY_ASSET = {
  id: '', storage_path: '', public_url: '', filename: '', mime_type: '', size_bytes: null,
  width: null, height: null, alt_text: '', caption: '', credit: '', kind: 'mentor_portrait',
  status: 'draft', is_public: false, linked_type: '', linked_id: '',
};

const KINDS = [
  { value: 'mentor_portrait', label: 'Mentor portrait' },
  { value: 'article_cover', label: 'Article cover' },
  { value: 'session_image', label: 'Session image' },
  { value: 'site_asset', label: 'Site asset' },
  { value: 'other', label: 'Other' },
];

function formatBytes(value) {
  if (!value) return 'Size not recorded';
  if (value < 1024 * 1024) return `${Math.round(value / 1024)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function formatKind(value) {
  return KINDS.find((kind) => kind.value === value)?.label || 'Asset';
}

function assetKey() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function StudioMedia() {
  const { canManageMedia, canManageMentors, isReadOnly, roleLabel } = useStudioPermissions();
  const canAttachMentor = canManageMentors;
  const supabase = createSupabaseBrowserClient();
  const [assets, setAssets] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_ASSET);
  const [file, setFile] = useState(null);
  const [localPreview, setLocalPreview] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [notice, setNotice] = useState('');
  const [savedAt, setSavedAt] = useState(null);
  const [dirty, setDirty] = useState(false);

  const visibleAssets = useMemo(() => filter === 'all' ? assets : assets.filter((asset) => asset.kind === filter), [assets, filter]);
  const imageUrl = localPreview || form.public_url;

  const load = async () => {
    if (!supabase) {
      setError('Studio is not configured for this deployment.');
      setLoading(false);
      return;
    }
    setLoading(true);
    const [{ data: assetRows, error: assetError }, { data: mentorRows }] = await Promise.all([
      supabase.from('media_assets').select('*').order('updated_at', { ascending: false }).limit(100),
      supabase.from('mentors').select('id, name, slug, image_url').order('name', { ascending: true }).limit(100),
    ]);
    if (assetError) setError(assetError.message || 'Media could not be loaded.');
    setAssets(assetRows || []);
    setMentors(mentorRows || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const onBeforeUnload = (event) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  const selectAsset = (asset) => {
    if (dirty && !window.confirm('You have unsaved media changes. Discard them?')) return;
    setSelected(asset);
    setForm({ ...EMPTY_ASSET, ...asset, linked_id: asset.linked_id || '' });
    setFile(null);
    setLocalPreview('');
    setFieldErrors({});
    setNotice('');
    setDirty(false);
  };

  const startNew = () => {
    if (!canManageMedia) return;
    if (dirty && !window.confirm('You have unsaved media changes. Discard them?')) return;
    setSelected(null);
    setForm(EMPTY_ASSET);
    setFile(null);
    setLocalPreview('');
    setFieldErrors({});
    setNotice('');
    setDirty(false);
  };

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setDirty(true);
    setNotice('');
    if (fieldErrors[key]) setFieldErrors((current) => ({ ...current, [key]: '' }));
  };

  const onFile = (event) => {
    const nextFile = event.target.files?.[0];
    if (!nextFile) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    const nextErrors = {};
    if (!allowed.includes(nextFile.type)) nextErrors.file = 'Use a JPG, PNG, or WebP image.';
    if (nextFile.size > 6 * 1024 * 1024) nextErrors.file = 'Keep images below 6MB.';
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setFile(nextFile);
    setLocalPreview(URL.createObjectURL(nextFile));
    update('filename', nextFile.name);
    update('mime_type', nextFile.type);
    update('size_bytes', nextFile.size);
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.id && !file) nextErrors.file = 'Choose an image before creating an asset.';
    if (!form.alt_text.trim() && form.kind !== 'other') nextErrors.alt_text = 'Add a useful description before publishing this asset.';
    if (form.is_public && form.status !== 'published') nextErrors.status = 'A public asset must have Published status.';
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const save = async (event) => {
    event.preventDefault();
    if (!canManageMedia || !supabase || !validate()) return;
    setSaving(true);
    setError('');
    setNotice('');
    let nextForm = { ...form };
    try {
      if (file) {
        const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const path = `library/${form.kind}/${assetKey()}.${extension}`;
        const { error: uploadError } = await supabase.storage.from('ca360-media').upload(path, file, {
          cacheControl: '31536000', upsert: false, contentType: file.type,
        });
        if (uploadError) throw uploadError;
        const { data: publicData } = supabase.storage.from('ca360-media').getPublicUrl(path);
        nextForm = { ...nextForm, storage_path: path, public_url: publicData.publicUrl, filename: file.name, mime_type: file.type, size_bytes: file.size };
      }

      const payload = {
        storage_path: nextForm.storage_path,
        public_url: nextForm.public_url,
        filename: nextForm.filename,
        mime_type: nextForm.mime_type,
        size_bytes: nextForm.size_bytes || null,
        width: nextForm.width || null,
        height: nextForm.height || null,
        alt_text: nextForm.alt_text.trim(),
        caption: nextForm.caption.trim() || null,
        credit: nextForm.credit.trim() || null,
        kind: nextForm.kind,
        status: nextForm.status,
        is_public: nextForm.is_public,
        linked_type: nextForm.linked_type || null,
        linked_id: nextForm.linked_id || null,
      };
      const result = nextForm.id
        ? await supabase.from('media_assets').update(payload).eq('id', nextForm.id).select('*').single()
        : await supabase.from('media_assets').insert(payload).select('*').single();
      if (result.error) throw result.error;

      if (canAttachMentor && nextForm.linked_type === 'mentor' && nextForm.linked_id && nextForm.public_url) {
        const { error: mentorError } = await supabase.from('mentors').update({ image_url: nextForm.public_url }).eq('id', nextForm.linked_id);
        if (mentorError) throw mentorError;
      }
      const saved = result.data;
      setAssets((current) => [saved, ...current.filter((asset) => asset.id !== saved.id)]);
      setSelected(saved);
      setForm({ ...EMPTY_ASSET, ...saved, linked_id: saved.linked_id || '' });
      setFile(null);
      setLocalPreview('');
      setDirty(false);
      setSavedAt(new Date().toISOString());
      setNotice('Asset saved.');
    } catch (saveError) {
      setError(saveError.message || 'The asset could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const archive = async () => {
    if (!canManageMedia || !form.id || !supabase) return;
    if (!window.confirm('Archive this asset? It will no longer be treated as public.')) return;
    setArchiving(true);
    const { data, error: archiveError } = await supabase.from('media_assets').update({ status: 'archived', is_public: false }).eq('id', form.id).select('*').single();
    if (archiveError) setError(archiveError.message || 'The asset could not be archived.');
    else {
      setAssets((current) => current.map((asset) => asset.id === data.id ? data : asset));
      setForm((current) => ({ ...current, ...data }));
      setSavedAt(new Date().toISOString());
      setNotice('Asset archived.');
    }
    setArchiving(false);
  };

  return (
    <StudioPage className="studio-page--media">
      <StudioPageHeader
        kicker="ASSET DESK"
        title="Media"
        description="One calm place for the images that make CA360 feel like itself. Add the description now; future-you will thank you."
        action={canManageMedia && <button type="button" className="studio-button studio-button--primary" onClick={startNew}><PlusIcon color="#0a1f29" size={14} /> New asset</button>}
      />
      {isReadOnly && <div className="studio-permission-note">You are viewing as <strong>{roleLabel}</strong>. Media editing is disabled for this account.</div>}
      {error && <ErrorState message={error} />}
      <div className="studio-media-layout">
        <section className="studio-panel studio-media-library" aria-labelledby="studio-media-library-title">
          <div className="studio-panel-head">
            <div><span className="studio-panel-kicker">LIBRARY</span><h2 id="studio-media-library-title">Approved assets</h2></div>
            <span className="studio-panel-count">{visibleAssets.length} shown</span>
          </div>
          <div className="studio-filter-row" aria-label="Filter assets">
            <button type="button" className={filter === 'all' ? 'is-active' : ''} onClick={() => setFilter('all')}>All</button>
            {KINDS.slice(0, 4).map((kind) => <button key={kind.value} type="button" className={filter === kind.value ? 'is-active' : ''} onClick={() => setFilter(kind.value)}>{kind.label.replace('Mentor ', '')}</button>)}
          </div>
          {loading ? <LoadingState label="Loading your asset desk…" /> : visibleAssets.length === 0 ? <EmptyState title="No assets here yet" description="Start with a mentor portrait or an article cover. Keep the original file somewhere safe too." action={canManageMedia && <button type="button" className="studio-button studio-button--secondary" onClick={startNew}>Add the first image <ArrowRight size={14} /></button>} /> : (
            <div className="studio-media-grid">
              {visibleAssets.map((asset) => (
                <button type="button" className={`studio-media-card${selected?.id === asset.id ? ' is-selected' : ''}`} key={asset.id} onClick={() => selectAsset(asset)}>
                  <span className="studio-media-thumb">{asset.public_url ? <img src={asset.public_url} alt="" /> : <span aria-hidden="true">IMG</span>}</span>
                  <span className="studio-media-card-copy"><strong>{asset.filename}</strong><small>{formatKind(asset.kind)} · {formatBytes(asset.size_bytes)}</small><StatusBadge status={asset.status} label={asset.status} /></span>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="studio-panel studio-media-editor" aria-labelledby="studio-media-editor-title">
          <div className="studio-panel-head"><div><span className="studio-panel-kicker">{form.id ? 'EDIT ASSET' : 'NEW ASSET'}</span><h2 id="studio-media-editor-title">Asset details</h2></div>{savedAt && <span className="studio-editor-save-state studio-editor-save-state--saved">Saved {formatStudioSaveTime(savedAt)}</span>}</div>
          <form onSubmit={save}>
            <div className="studio-media-upload">
              <div className="studio-media-upload-preview">{imageUrl ? <img src={imageUrl} alt={form.alt_text || ''} /> : <span>Choose<br />an image</span>}</div>
              <div><label className="studio-field-label" htmlFor="media-file">FILE</label><input id="media-file" type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile} disabled={!canManageMedia} /><p className="studio-field-hint">JPG, PNG, or WebP · maximum 6MB. New uploads receive a fresh path so replacements never get stuck in cache.</p><FieldError id="media-file-error">{fieldErrors.file}</FieldError></div>
            </div>
            <div className="studio-form-grid studio-form-grid--two">
              <label className="studio-field"><span className="studio-field-label">ASSET TYPE</span><select value={form.kind} onChange={(event) => update('kind', event.target.value)} disabled={!canManageMedia}>{KINDS.map((kind) => <option key={kind.value} value={kind.value}>{kind.label}</option>)}</select></label>
              <label className="studio-field"><span className="studio-field-label">WORKFLOW</span><select value={form.status} onChange={(event) => update('status', event.target.value)} disabled={!canManageMedia}><option value="draft">Draft</option><option value="review">In review</option><option value="published">Published</option><option value="archived">Archived</option></select><FieldError>{fieldErrors.status}</FieldError></label>
            </div>
            <label className="studio-field"><span className="studio-field-label">ALT TEXT <em>Required for anything public</em></span><textarea value={form.alt_text} onChange={(event) => update('alt_text', event.target.value)} placeholder="Example: Dr A. Asare speaking with students after a CA360 session." rows={3} disabled={!canManageMedia} /><span className="studio-field-hint">Describe what matters in the image, not every visual detail. If it is decorative, write “Decorative image” and keep it out of the reading flow.</span><FieldError>{fieldErrors.alt_text}</FieldError></label>
            <label className="studio-field"><span className="studio-field-label">CAPTION <em>Optional</em></span><input value={form.caption || ''} onChange={(event) => update('caption', event.target.value)} placeholder="A short line shown beside the image, when needed." disabled={!canManageMedia} /></label>
            <label className="studio-field"><span className="studio-field-label">CREDIT <em>Optional</em></span><input value={form.credit || ''} onChange={(event) => update('credit', event.target.value)} placeholder="Photographer, partner, or source." disabled={!canManageMedia} /></label>
            <div className="studio-form-grid studio-form-grid--two">
              <label className="studio-field"><span className="studio-field-label">ATTACH TO <em>{canAttachMentor ? 'Optional' : 'Coordinator access required'}</em></span><select value={form.linked_id || ''} onChange={(event) => { update('linked_id', event.target.value); update('linked_type', event.target.value ? 'mentor' : ''); }} disabled={!canManageMedia || !canAttachMentor}><option value="">No mentor record</option>{mentors.map((mentor) => <option key={mentor.id} value={mentor.id}>{mentor.name}</option>)}</select>{!canAttachMentor && <span className="studio-field-hint">The asset can still be edited here. Connecting it to a mentor also changes the mentor record, so only coordinators can do that.</span>}</label>
              <label className="studio-check"><input type="checkbox" checked={form.is_public} onChange={(event) => update('is_public', event.target.checked)} disabled={!canManageMedia} /><span><strong>Mark public</strong><small>Only use with Published status.</small></span></label>
            </div>
            <div className="studio-editor-foot"><span className={`studio-editor-save-state${dirty ? ' studio-editor-save-state--dirty' : ''}`}>{dirty ? 'Unsaved changes' : form.id ? 'No unsaved changes' : 'Not saved yet'}</span><div className="studio-editor-actions">{form.id && canManageMedia && <button type="button" className="studio-button studio-button--quiet" onClick={archive} disabled={archiving}>{archiving ? 'Archiving…' : 'Archive'}</button>}{canManageMedia && <button type="submit" className="studio-button studio-button--primary" disabled={saving}>{saving ? 'Saving…' : form.id ? 'Save asset' : 'Create asset'} <ArrowRight color="#0a1f29" size={14} /></button>}</div></div>
            {notice && <p className="studio-inline-success" role="status">{notice}</p>}
          </form>
        </section>
      </div>
    </StudioPage>
  );
}
