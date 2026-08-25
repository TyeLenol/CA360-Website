'use client';

import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '../../lib/supabase/client';
import { ArrowRight, PlusIcon } from '../shared/Icons';
import { EmptyState, ErrorState, FieldError, LoadingState, StatusBadge, StudioPage, StudioPageHeader, formatStudioSaveTime } from './StudioShared';
import { useStudioPermissions } from './StudioPermissions';
import { revalidatePublicContent } from '../../lib/studio/revalidate';

const EMPTY_OPPORTUNITY = {
  eyebrow: 'Right now at CA360', title: 'Cohort 06 is open.', body: 'Start with the next honest conversation about what comes after SHS — then stay close as new fields, sessions and mentors open up.', primary_label: 'Get cohort updates', primary_href: '#news', secondary_label: 'See how it works', secondary_href: '#programs', status_label: 'COHORT OPEN', metric_one_value: '2K+', metric_one_label: 'STUDENTS REACHED', metric_two_value: '9/10', metric_two_label: 'AVG SESSION RATING', status: 'published', is_public: true,
};
const EMPTY_FAQ = { id: '', slug: '', category: 'GENERAL', question: '', answer: '', sort_order: 10, status: 'draft', is_public: false };
const FAQ_CATEGORIES = ['STUDENTS', 'COSTS', 'MENTORS', 'SCHOOLS', 'FIELDS', 'GENERAL'];

export function StudioContent() {
  const { canManageContent, isReadOnly, roleLabel, role } = useStudioPermissions();
  const canPublish = role === 'admin' || role === 'coordinator';
  const supabase = createSupabaseBrowserClient();
  const [opportunity, setOpportunity] = useState(EMPTY_OPPORTUNITY);
  const [faq, setFaq] = useState(EMPTY_FAQ);
  const [faqs, setFaqs] = useState([]);
  const [active, setActive] = useState('opportunity');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [dirty, setDirty] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const opportunityEditorEnabled = canManageContent && (canPublish || opportunity.status !== 'published');
  const faqEditorEnabled = canManageContent && (canPublish || faq.status !== 'published');

  const load = async () => {
    if (!supabase) { setError('Studio is not configured for this deployment.'); setLoading(false); return; }
    setLoading(true);
    const [{ data: contentRow, error: contentError }, { data: faqRows, error: faqError }] = await Promise.all([
      supabase.from('site_content').select('*').eq('key', 'current_opportunity').limit(1).maybeSingle(),
      supabase.from('site_faqs').select('*').order('sort_order', { ascending: true }).limit(100),
    ]);
    if (contentError || faqError) setError((contentError || faqError).message || 'Site content could not be loaded.');
    setOpportunity({ ...EMPTY_OPPORTUNITY, ...(contentRow?.content || {}), status: contentRow?.status || 'published', is_public: contentRow?.is_public ?? true });
    setFaqs(faqRows || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);
  useEffect(() => {
    const onBeforeUnload = (event) => { if (!dirty) return; event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  const switchTo = (next) => {
    if (dirty && !window.confirm('You have unsaved content changes. Discard them?')) return;
    setActive(next); setNotice(''); setFieldErrors({}); setDirty(false);
  };

  const selectFAQ = (record) => {
    if (dirty && !window.confirm('You have unsaved FAQ changes. Discard them?')) return;
    setActive('faq'); setFaq({ ...EMPTY_FAQ, ...record }); setNotice(''); setFieldErrors({}); setDirty(false);
  };

  const newFAQ = () => {
    if (!canManageContent || (dirty && !window.confirm('You have unsaved FAQ changes. Discard them?'))) return;
    setActive('faq'); setFaq(EMPTY_FAQ); setNotice(''); setFieldErrors({}); setDirty(false);
  };

  const updateOpportunity = (key, value) => { setOpportunity((current) => ({ ...current, [key]: value })); setDirty(true); setNotice(''); if (fieldErrors[key]) setFieldErrors((current) => ({ ...current, [key]: '' })); };
  const updateFaq = (key, value) => { setFaq((current) => ({ ...current, [key]: value })); setDirty(true); setNotice(''); if (fieldErrors[key]) setFieldErrors((current) => ({ ...current, [key]: '' })); };

  const validateOpportunity = () => {
    const next = {};
    ['title', 'body', 'primary_label', 'primary_href'].forEach((key) => { if (!String(opportunity[key] || '').trim()) next[key] = 'This field is needed for the public block.'; });
    if (opportunity.is_public && opportunity.status !== 'published') next.status = 'A public opportunity block must be Published.';
    if (!canPublish && opportunity.status === 'published') next.status = 'Only an admin or coordinator can publish content.';
    setFieldErrors(next); return Object.keys(next).length === 0;
  };

  const validateFAQ = () => {
    const next = {};
    if (!faq.question.trim()) next.question = 'Write the question visitors will ask.';
    if (!faq.answer.trim()) next.answer = 'Add the clear answer visitors need.';
    if (faq.is_public && faq.status !== 'published') next.status = 'A public FAQ must be Published.';
    if (!canPublish && faq.status === 'published') next.status = 'Only an admin or coordinator can publish FAQs.';
    setFieldErrors(next); return Object.keys(next).length === 0;
  };

  const save = async (event) => {
    event.preventDefault();
    if (!canManageContent || !supabase) return;
    const valid = active === 'opportunity' ? validateOpportunity() : validateFAQ();
    if (!valid) return;
    setSaving(true); setError(''); setNotice('');
    try {
      if (active === 'opportunity') {
        const { status, is_public, ...content } = opportunity;
        const payload = { key: 'current_opportunity', label: 'Current opportunity', content, status, is_public: Boolean(is_public) };
        const { error: saveError } = await supabase.from('site_content').upsert(payload, { onConflict: 'key' });
        if (saveError) throw saveError;
        setDirty(false); setSavedAt(new Date().toISOString()); setNotice('Opportunity saved. The homepage is refreshing.');
      } else {
        const payload = { slug: faq.slug.trim() || faq.question.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''), category: faq.category, question: faq.question.trim(), answer: faq.answer.trim(), sort_order: Number(faq.sort_order) || 0, status: faq.status, is_public: faq.is_public };
        const result = faq.id ? await supabase.from('site_faqs').update(payload).eq('id', faq.id).select('*').single() : await supabase.from('site_faqs').insert(payload).select('*').single();
        if (result.error) throw result.error;
        setFaqs((current) => [result.data, ...current.filter((item) => item.id !== result.data.id)].sort((a, b) => a.sort_order - b.sort_order));
        setFaq({ ...EMPTY_FAQ, ...result.data }); setDirty(false); setSavedAt(new Date().toISOString()); setNotice('FAQ saved. The homepage is refreshing.');
      }
      void revalidatePublicContent();
    } catch (saveError) { setError(saveError.message || 'The content could not be saved.'); }
    finally { setSaving(false); }
  };

  return (
    <StudioPage className="studio-page--content">
      <StudioPageHeader kicker="SITE DESK" title="Site content" description="Small, named pieces of public copy. Change the words without opening the whole homepage." action={canManageContent && <button type="button" className="studio-button studio-button--primary" onClick={newFAQ}><PlusIcon color="#0a1f29" size={14} /> New FAQ</button>} />
      {isReadOnly && <div className="studio-permission-note">You are viewing as <strong>{roleLabel}</strong>. Site content editing is disabled for this account.</div>}
      {!canPublish && canManageContent && <div className="studio-permission-note">You can prepare content and save drafts. An admin or coordinator publishes public changes.</div>}
      {error && <ErrorState message={error} />}
      <div className="studio-editor-layout">
        <section className="studio-panel studio-record-list" aria-labelledby="studio-content-list-title">
          <div className="studio-panel-head"><div><span className="studio-panel-kicker">CONTENT MAP</span><h2 id="studio-content-list-title">Public blocks</h2></div><span className="studio-panel-count">{faqs.length + 1}</span></div>
          <button type="button" className={`studio-record-row${active === 'opportunity' ? ' is-selected' : ''}`} onClick={() => switchTo('opportunity')}><span className="studio-record-row-mark">01</span><span><strong>Current opportunity</strong><small>Homepage signal, metrics, CTAs</small></span><StatusBadge status={opportunity.status} label={opportunity.is_public && opportunity.status === 'published' ? 'live' : opportunity.status} /></button>
          <div className="studio-list-divider">FAQs <span>{faqs.length}</span></div>
          {loading ? <LoadingState label="Loading site content…" /> : faqs.length === 0 ? <EmptyState title="No FAQs yet" description="Add the questions visitors ask before they email you." action={canManageContent && <button type="button" className="studio-button studio-button--secondary" onClick={newFAQ}>Add an FAQ <ArrowRight size={14} /></button>} /> : <div className="studio-record-list-items">{faqs.map((record) => <button type="button" className={`studio-record-row${active === 'faq' && faq.id === record.id ? ' is-selected' : ''}`} key={record.id} onClick={() => selectFAQ(record)}><span className="studio-record-row-mark">—</span><span><strong>{record.question}</strong><small>{record.category} · order {record.sort_order}</small></span><StatusBadge status={record.status} label={record.status} /></button>)}</div>}
        </section>
        <section className="studio-panel studio-editor-panel" aria-labelledby="studio-content-editor-title">
          <div className="studio-panel-head"><div><span className="studio-panel-kicker">{active === 'opportunity' ? 'EDIT BLOCK' : faq.id ? 'EDIT FAQ' : 'NEW FAQ'}</span><h2 id="studio-content-editor-title">{active === 'opportunity' ? 'Current opportunity' : 'Question & answer'}</h2></div>{savedAt && <span className="studio-editor-save-state studio-editor-save-state--saved">Saved {formatStudioSaveTime(savedAt)}</span>}</div>
          <form onSubmit={save}>
            {active === 'opportunity' ? <>
              <label className="studio-field"><span className="studio-field-label">EYEBROW</span><input value={opportunity.eyebrow} onChange={(event) => updateOpportunity('eyebrow', event.target.value)} disabled={!opportunityEditorEnabled} /></label>
              <label className="studio-field"><span className="studio-field-label">HEADLINE</span><input value={opportunity.title} onChange={(event) => updateOpportunity('title', event.target.value)} disabled={!opportunityEditorEnabled} /><FieldError>{fieldErrors.title}</FieldError></label>
              <label className="studio-field"><span className="studio-field-label">BODY COPY</span><textarea rows={4} value={opportunity.body} onChange={(event) => updateOpportunity('body', event.target.value)} disabled={!opportunityEditorEnabled} /><FieldError>{fieldErrors.body}</FieldError></label>
              <div className="studio-form-grid studio-form-grid--two"><label className="studio-field"><span className="studio-field-label">PRIMARY CTA LABEL</span><input value={opportunity.primary_label} onChange={(event) => updateOpportunity('primary_label', event.target.value)} disabled={!opportunityEditorEnabled} /><FieldError>{fieldErrors.primary_label}</FieldError></label><label className="studio-field"><span className="studio-field-label">PRIMARY CTA LINK</span><input value={opportunity.primary_href} onChange={(event) => updateOpportunity('primary_href', event.target.value)} disabled={!opportunityEditorEnabled} /><FieldError>{fieldErrors.primary_href}</FieldError></label></div>
              <div className="studio-form-grid studio-form-grid--two"><label className="studio-field"><span className="studio-field-label">SECONDARY CTA LABEL</span><input value={opportunity.secondary_label} onChange={(event) => updateOpportunity('secondary_label', event.target.value)} disabled={!opportunityEditorEnabled} /></label><label className="studio-field"><span className="studio-field-label">SECONDARY CTA LINK</span><input value={opportunity.secondary_href} onChange={(event) => updateOpportunity('secondary_href', event.target.value)} disabled={!opportunityEditorEnabled} /></label></div>
              <div className="studio-form-grid studio-form-grid--two"><label className="studio-field"><span className="studio-field-label">STATUS LABEL</span><input value={opportunity.status_label} onChange={(event) => updateOpportunity('status_label', event.target.value)} disabled={!opportunityEditorEnabled} /></label><label className="studio-field"><span className="studio-field-label">METRIC ONE</span><input value={`${opportunity.metric_one_value} · ${opportunity.metric_one_label}`} onChange={(event) => { const [value, ...label] = event.target.value.split(' · '); updateOpportunity('metric_one_value', value); updateOpportunity('metric_one_label', label.join(' · ')); }} disabled={!opportunityEditorEnabled} /></label></div>
              <div className="studio-form-grid studio-form-grid--two"><label className="studio-field"><span className="studio-field-label">METRIC TWO</span><input value={`${opportunity.metric_two_value} · ${opportunity.metric_two_label}`} onChange={(event) => { const [value, ...label] = event.target.value.split(' · '); updateOpportunity('metric_two_value', value); updateOpportunity('metric_two_label', label.join(' · ')); }} disabled={!opportunityEditorEnabled} /></label><label className="studio-field"><span className="studio-field-label">WORKFLOW</span><select value={opportunity.status} onChange={(event) => updateOpportunity('status', event.target.value)} disabled={!opportunityEditorEnabled || !canPublish}><option value="draft">Draft</option><option value="review">In review</option>{canPublish && <option value="published">Published</option>}<option value="archived">Archived</option></select><FieldError>{fieldErrors.status}</FieldError></label></div>
              <div className="studio-editor-options"><label className="studio-check"><input type="checkbox" checked={Boolean(opportunity.is_public)} onChange={(event) => updateOpportunity('is_public', event.target.checked)} disabled={!opportunityEditorEnabled || !canPublish} /><span><strong>Make public</strong><small>Requires Published status.</small></span></label><div className="studio-field"><span className="studio-field-label">PUBLISHING NOTE</span><p className="studio-field-hint">{opportunityEditorEnabled ? 'Save a draft while copy is in progress, or publish when the homepage block is ready.' : 'This block is currently Published. Admin or coordinator access is required to edit its public copy.'}</p></div></div>
            </> : <>
              <div className="studio-form-grid studio-form-grid--two"><label className="studio-field"><span className="studio-field-label">CATEGORY</span><select value={faq.category} onChange={(event) => updateFaq('category', event.target.value)} disabled={!faqEditorEnabled}>{FAQ_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}</select></label><label className="studio-field"><span className="studio-field-label">WORKFLOW</span><select value={faq.status} onChange={(event) => updateFaq('status', event.target.value)} disabled={!faqEditorEnabled || (!canPublish && faq.status === 'published')}><option value="draft">Draft</option><option value="review">In review</option>{canPublish && <option value="published">Published</option>}<option value="archived">Archived</option></select><FieldError>{fieldErrors.status}</FieldError></label></div>
              <label className="studio-field"><span className="studio-field-label">QUESTION</span><input value={faq.question} onChange={(event) => updateFaq('question', event.target.value)} placeholder="Example: Who can attend a session?" disabled={!faqEditorEnabled} /><FieldError>{fieldErrors.question}</FieldError></label>
              <label className="studio-field"><span className="studio-field-label">ANSWER</span><textarea className="studio-textarea--tall" rows={8} value={faq.answer} onChange={(event) => updateFaq('answer', event.target.value)} placeholder="Answer the actual concern plainly. Put the useful detail before the institutional language." disabled={!faqEditorEnabled} /><span className="studio-field-hint">Write for a student who has never heard the internal vocabulary. Keep one answer focused on one question.</span><FieldError>{fieldErrors.answer}</FieldError></label>
              <div className="studio-form-grid studio-form-grid--two"><label className="studio-field"><span className="studio-field-label">ORDER</span><input type="number" min="0" value={faq.sort_order} onChange={(event) => updateFaq('sort_order', event.target.value)} disabled={!faqEditorEnabled} /></label><label className="studio-check"><input type="checkbox" checked={faq.is_public} onChange={(event) => updateFaq('is_public', event.target.checked)} disabled={!faqEditorEnabled} /><span><strong>Make public</strong><small>Requires Published status.</small></span></label></div>
            </>}
            <div className="studio-editor-foot"><span className={`studio-editor-save-state${dirty ? ' studio-editor-save-state--dirty' : ''}`}>{dirty ? 'Unsaved changes' : active === 'opportunity' || faq.id ? 'No unsaved changes' : 'Not saved yet'}</span>{(active === 'opportunity' ? opportunityEditorEnabled : faqEditorEnabled) && <button type="submit" className="studio-button studio-button--primary" disabled={saving}>{saving ? 'Saving…' : active === 'opportunity' ? 'Save block' : faq.id ? 'Save FAQ' : 'Create FAQ'} <ArrowRight color="#0a1f29" size={14} /></button>}</div>
            {notice && <p className="studio-inline-success" role="status">{notice}</p>}
          </form>
        </section>
      </div>
    </StudioPage>
  );
}
