'use client';

import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '../../lib/supabase/client';
import { ArrowRight, PlusIcon } from '../shared/Icons';
import { EmptyState, ErrorState, FieldError, LoadingState, StatusBadge, StudioPage, StudioPageHeader, formatStudioSaveTime } from './StudioShared';
import { useStudioPermissions } from './StudioPermissions';
import { normalizeSlug } from './StudioShared';
import { revalidatePublicContent } from '../../lib/studio/revalidate';

const EMPTY_ARTICLE = {
  id: '', slug: '', title: '', excerpt: '', body: '', category: 'mentor', category_label: 'MENTOR STORY',
  author: '', author_role: '', author_seed: 1, published_at: '', read_time: '5 min read', tone: 'teal',
  label: 'STORY', featured: false, cover_url: '', status: 'draft', is_public: false,
};

const CATEGORIES = [
  { value: 'mentor', label: 'Mentor story', categoryLabel: 'MENTOR STORY' },
  { value: 'student', label: 'Student story', categoryLabel: 'STUDENT STORY' },
  { value: 'guide', label: 'Career guide', categoryLabel: 'CAREER GUIDE' },
  { value: 'news', label: 'News & updates', categoryLabel: 'NEWS & UPDATES' },
];

const TONES = ['teal', 'warm', 'orange', 'deep', 'cream'];

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function StudioJournal() {
  const { canManageJournal, isReadOnly, roleLabel, role } = useStudioPermissions();
  const canPublish = role === 'admin' || role === 'coordinator';
  const supabase = createSupabaseBrowserClient();
  const [articles, setArticles] = useState([]);
  const [mediaCovers, setMediaCovers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY_ARTICLE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [dirty, setDirty] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const editorEnabled = canManageJournal && (canPublish || form.status !== 'published');

  const load = async () => {
    if (!supabase) { setError('Studio is not configured for this deployment.'); setLoading(false); return; }
    setLoading(true);
    const [{ data, error: loadError }, { data: coverRows }] = await Promise.all([
      supabase.from('journal_articles').select('*').order('featured', { ascending: false }).order('published_at', { ascending: false }).limit(100),
      supabase.from('media_assets').select('id, filename, public_url, alt_text').eq('kind', 'article_cover').eq('status', 'published').eq('is_public', true).order('updated_at', { ascending: false }).limit(100),
    ]);
    if (loadError) setError(loadError.message || 'Journal articles could not be loaded.');
    setArticles(data || []);
    setMediaCovers(coverRows || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);
  useEffect(() => {
    const onBeforeUnload = (event) => { if (!dirty) return; event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  const selectArticle = (article) => {
    if (dirty && !window.confirm('You have unsaved article changes. Discard them?')) return;
    setSelected(article);
    setForm({ ...EMPTY_ARTICLE, ...article, published_at: article.published_at || '' });
    setFieldErrors({}); setNotice(''); setDirty(false);
  };

  const startNew = () => {
    if (!canManageJournal || (dirty && !window.confirm('You have unsaved article changes. Discard them?'))) return;
    setSelected(null); setForm(EMPTY_ARTICLE); setFieldErrors({}); setNotice(''); setDirty(false);
  };

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setDirty(true); setNotice('');
    if (fieldErrors[key]) setFieldErrors((current) => ({ ...current, [key]: '' }));
  };

  const onCategory = (value) => {
    const category = CATEGORIES.find((item) => item.value === value);
    setForm((current) => ({ ...current, category: value, category_label: category?.categoryLabel || 'STORY' }));
    setDirty(true);
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = 'Add the headline readers will see.';
    if (!form.slug.trim()) nextErrors.slug = 'Add a URL slug or use Generate from title.';
    if (!form.excerpt.trim()) nextErrors.excerpt = 'Add a short standfirst for the archive card.';
    if (!form.body.trim()) nextErrors.body = 'Add the article body before saving.';
    if (!form.author.trim()) nextErrors.author = 'Add the byline.';
    if (form.is_public && form.status !== 'published') nextErrors.status = 'A public article must be Published.';
    if (form.status === 'published' && !form.published_at) nextErrors.published_at = 'Add a publication date before publishing.';
    if (form.status === 'published' && !canPublish) nextErrors.status = 'Only an admin or coordinator can publish articles.';
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const save = async (event) => {
    event.preventDefault();
    if (!canManageJournal || !supabase || !validate()) return;
    setSaving(true); setError(''); setNotice('');
    const payload = {
      slug: normalizeSlug(form.slug), title: form.title.trim(), excerpt: form.excerpt.trim(), body: form.body.trim(),
      category: form.category, category_label: form.category_label, author: form.author.trim(), author_role: form.author_role.trim() || null,
      author_seed: Number(form.author_seed) || 1, published_at: form.published_at || null, read_time: form.read_time.trim() || '5 min read',
      tone: form.tone, label: form.label.trim() || 'STORY', featured: Boolean(form.featured), cover_url: form.cover_url.trim() || null,
      status: form.status, is_public: Boolean(form.is_public), updated_by: undefined,
    };
    try {
      const result = form.id
        ? await supabase.from('journal_articles').update(payload).eq('id', form.id).select('*').single()
        : await supabase.from('journal_articles').insert(payload).select('*').single();
      if (result.error) throw result.error;
      const saved = result.data;
      setArticles((current) => [saved, ...current.filter((article) => article.id !== saved.id)].sort((a, b) => Number(b.featured) - Number(a.featured) || String(b.published_at || '').localeCompare(String(a.published_at || ''))));
      setSelected(saved); setForm({ ...EMPTY_ARTICLE, ...saved, published_at: saved.published_at || '' }); setDirty(false); setSavedAt(new Date().toISOString()); setNotice('Article saved. Public pages are refreshing.');
      void revalidatePublicContent();
    } catch (saveError) { setError(saveError.message || 'The article could not be saved.'); }
    finally { setSaving(false); }
  };

  return (
    <StudioPage className="studio-page--journal">
      <StudioPageHeader kicker="EDITORIAL DESK" title="Journal" description="Write the useful things. Keep drafts private. Publish only when the headline, standfirst, body, and byline are ready." action={canManageJournal && <button type="button" className="studio-button studio-button--primary" onClick={startNew}><PlusIcon color="#0a1f29" size={14} /> New article</button>} />
      {isReadOnly && <div className="studio-permission-note">You are viewing as <strong>{roleLabel}</strong>. Journal editing is disabled for this account.</div>}
      {!canPublish && canManageJournal && <div className="studio-permission-note">You can create drafts and send articles for review. An admin or coordinator publishes them.</div>}
      {error && <ErrorState message={error} />}
      <div className="studio-editor-layout">
        <section className="studio-panel studio-record-list" aria-labelledby="studio-journal-list-title">
          <div className="studio-panel-head"><div><span className="studio-panel-kicker">ARCHIVE</span><h2 id="studio-journal-list-title">Articles</h2></div><span className="studio-panel-count">{articles.length}</span></div>
          {loading ? <LoadingState label="Loading the editorial desk…" /> : articles.length === 0 ? <EmptyState title="No articles yet" description="Start with the story or guide you want a student to find first." action={canManageJournal && <button type="button" className="studio-button studio-button--secondary" onClick={startNew}>Write the first one <ArrowRight size={14} /></button>} /> : <div className="studio-record-list-items">{articles.map((article) => <button type="button" className={`studio-record-row${selected?.id === article.id ? ' is-selected' : ''}`} key={article.id} onClick={() => selectArticle(article)}><span className="studio-record-row-mark">{article.featured ? '★' : '—'}</span><span><strong>{article.title}</strong><small>{article.category_label} · {article.author || 'No byline'}</small></span><StatusBadge status={article.status} label={article.status} /></button>)}</div>}
        </section>
        <section className="studio-panel studio-editor-panel" aria-labelledby="studio-journal-editor-title">
          <div className="studio-panel-head"><div><span className="studio-panel-kicker">{form.id ? 'EDIT ARTICLE' : 'NEW ARTICLE'}</span><h2 id="studio-journal-editor-title">The story</h2></div>{savedAt && <span className="studio-editor-save-state studio-editor-save-state--saved">Saved {formatStudioSaveTime(savedAt)}</span>}</div>
          <form onSubmit={save}>
            <div className="studio-form-grid studio-form-grid--two">
              <label className="studio-field"><span className="studio-field-label">CATEGORY</span><select value={form.category} onChange={(event) => onCategory(event.target.value)} disabled={!editorEnabled}>{CATEGORIES.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}</select></label>
              <label className="studio-field"><span className="studio-field-label">WORKFLOW</span><select value={form.status} onChange={(event) => update('status', event.target.value)} disabled={!editorEnabled || (!canPublish && form.status === 'published')}><option value="draft">Draft</option><option value="review">In review</option>{canPublish && <option value="published">Published</option>}<option value="archived">Archived</option></select><FieldError>{fieldErrors.status}</FieldError></label>
            </div>
            <label className="studio-field"><span className="studio-field-label">HEADLINE</span><input value={form.title} onChange={(event) => update('title', event.target.value)} placeholder="Example: The question I wish someone asked me at 17." disabled={!editorEnabled} /><p className="studio-field-hint">Aim for a specific promise or tension. Avoid a headline that could belong to any website.</p><FieldError>{fieldErrors.title}</FieldError></label>
            <div className="studio-field"><span className="studio-field-label">URL SLUG</span><div className="studio-slug-row"><input value={form.slug} onChange={(event) => update('slug', event.target.value)} placeholder="the-question-i-wish-someone-asked" disabled={!editorEnabled} /><button type="button" className="studio-button studio-button--quiet" onClick={() => update('slug', normalizeSlug(form.title))} disabled={!editorEnabled || !form.title}>Generate</button></div><FieldError>{fieldErrors.slug}</FieldError></div>
            <label className="studio-field"><span className="studio-field-label">STANDFIRST <em>Shown on cards and previews</em></span><textarea value={form.excerpt} onChange={(event) => update('excerpt', event.target.value)} placeholder="Two or three sentences that make the reader want to stay." rows={3} disabled={!editorEnabled} /><span className="studio-field-hint">Write the useful reason to open this piece. Do not repeat the headline.</span><FieldError>{fieldErrors.excerpt}</FieldError></label>
            <label className="studio-field"><span className="studio-field-label">ARTICLE BODY</span><textarea className="studio-textarea--tall" value={form.body} onChange={(event) => update('body', event.target.value)} placeholder="Write in short, breathable paragraphs. One idea at a time." rows={10} disabled={!editorEnabled} /><span className="studio-field-hint">Plain text is supported for now. Use a blank line between paragraphs; the public reader will preserve that rhythm.</span><FieldError>{fieldErrors.body}</FieldError></label>
            <div className="studio-form-grid studio-form-grid--two">
              <label className="studio-field"><span className="studio-field-label">BYLINE</span><input value={form.author} onChange={(event) => update('author', event.target.value)} placeholder="Dr. A. Asare" disabled={!editorEnabled} /><FieldError>{fieldErrors.author}</FieldError></label>
              <label className="studio-field"><span className="studio-field-label">BYLINE ROLE <em>Optional</em></span><input value={form.author_role || ''} onChange={(event) => update('author_role', event.target.value)} placeholder="Founder · CA360" disabled={!editorEnabled} /></label>
            </div>
            <div className="studio-form-grid studio-form-grid--three">
              <label className="studio-field"><span className="studio-field-label">PUBLISHED DATE</span><input type="date" value={form.published_at || ''} onChange={(event) => update('published_at', event.target.value)} disabled={!editorEnabled} /><FieldError>{fieldErrors.published_at}</FieldError></label>
              <label className="studio-field"><span className="studio-field-label">READ TIME</span><input value={form.read_time} onChange={(event) => update('read_time', event.target.value)} placeholder="5 min read" disabled={!editorEnabled} /></label>
              <label className="studio-field"><span className="studio-field-label">TONE</span><select value={form.tone} onChange={(event) => update('tone', event.target.value)} disabled={!editorEnabled}>{TONES.map((tone) => <option key={tone} value={tone}>{tone}</option>)}</select></label>
            </div>
            <label className="studio-field"><span className="studio-field-label">COVER IMAGE <em>Optional · approved Media only</em></span><select value={form.cover_url || ''} onChange={(event) => update('cover_url', event.target.value)} disabled={!editorEnabled}><option value="">No cover image</option>{form.cover_url && !mediaCovers.some((asset) => asset.public_url === form.cover_url) && <option value={form.cover_url}>Current cover</option>}{mediaCovers.map((asset) => <option key={asset.id} value={asset.public_url}>{asset.filename || 'Untitled cover'}</option>)}</select><span className="studio-field-hint">Publish an article cover in Media first, then choose it here. The public Journal falls back to its illustrated placeholder when no cover is selected.</span></label>
            <div className="studio-editor-options"><label className="studio-check"><input type="checkbox" checked={Boolean(form.featured)} onChange={(event) => update('featured', event.target.checked)} disabled={!editorEnabled} /><span><strong>Feature this article</strong><small>Only one piece should lead the Journal at a time.</small></span></label><label className="studio-check"><input type="checkbox" checked={Boolean(form.is_public)} onChange={(event) => update('is_public', event.target.checked)} disabled={!editorEnabled} /><span><strong>Make public</strong><small>Requires Published status.</small></span></label></div>
            <div className="studio-editor-foot"><span className={`studio-editor-save-state${dirty ? ' studio-editor-save-state--dirty' : ''}`}>{dirty ? 'Unsaved changes' : form.id ? 'No unsaved changes' : 'Not saved yet'}</span>{editorEnabled && <button type="submit" className="studio-button studio-button--primary" disabled={saving}>{saving ? 'Saving…' : form.id ? 'Save article' : 'Create article'} <ArrowRight color="#0a1f29" size={14} /></button>}</div>
            {notice && <p className="studio-inline-success" role="status">{notice}</p>}
          </form>
        </section>
      </div>
    </StudioPage>
  );
}
