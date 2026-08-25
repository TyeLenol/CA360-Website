'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from '../shared/Icons';
import { createSupabaseBrowserClient } from '../../lib/supabase/client';
import { EmptyState, ErrorState, formatStudioDateTime, LoadingState, StatusBadge, StudioPage, StudioPageHeader } from './StudioShared';

const supabase = createSupabaseBrowserClient();
const FILTERS = [
  { value: 'all', label: 'All messages' },
  { value: 'new', label: 'New' },
  { value: 'reviewing', label: 'Reviewing' },
  { value: 'replied', label: 'Replied' },
  { value: 'closed', label: 'Closed' },
];

export function StudioInbox() {
  const [messages, setMessages] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = async () => {
    setLoading(true);
    const { data, error: loadError } = await supabase.from('contact_messages').select('id, topic, name, email, phone, message, selected_mentor_id, status, created_at, updated_at').order('created_at', { ascending: false }).limit(100);
    if (loadError) setError('The inbox could not be loaded. Check your Studio access and try again.');
    setMessages(data || []);
    setSelectedId((current) => current || data?.[0]?.id || '');
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const visibleMessages = useMemo(() => filter === 'all' ? messages : messages.filter((message) => message.status === filter), [filter, messages]);
  const selected = messages.find((message) => message.id === selectedId) || visibleMessages[0];

  const updateStatus = async (status) => {
    if (!selected) return;
    setSaving(true);
    setNotice('');
    const { error: updateError } = await supabase.from('contact_messages').update({ status }).eq('id', selected.id);
    if (updateError) setError('That message status could not be saved.');
    else {
      setMessages((current) => current.map((message) => message.id === selected.id ? { ...message, status } : message));
      setNotice('Message status updated.');
    }
    setSaving(false);
  };

  if (loading) return <StudioPage><LoadingState label="Loading inbox…" /></StudioPage>;
  if (error && !messages.length) return <StudioPage><ErrorState message={error} /></StudioPage>;

  return (
    <StudioPage className="studio-queue-page">
      <StudioPageHeader kicker="THE OPEN DOOR" title={<>A message is<br /><em>someone reaching.</em></>} description="Keep the first reply human. Sort the queue, open the context, and make the next response easy to own." action={<a className="studio-primary-button" href="mailto:hello@careerarcadia360.org">Open email <ArrowRight size={15} /></a>} />
      <div className="studio-filter-row" role="group" aria-label="Filter contact messages">{FILTERS.map((item) => <button key={item.value} className={filter === item.value ? 'is-active' : ''} type="button" onClick={() => setFilter(item.value)}>{item.label}<span>{item.value === 'all' ? messages.length : messages.filter((message) => message.status === item.value).length}</span></button>)}</div>

      {visibleMessages.length === 0 ? <EmptyState title="Nothing in this view." description="The inbox is quiet here. Try another status filter or return when the next question arrives." /> : <div className="studio-split-layout">
        <section className="studio-queue-list" aria-label="Contact message list">{visibleMessages.map((message) => <button key={message.id} type="button" className={`studio-queue-item${message.id === selected?.id ? ' is-selected' : ''}`} onClick={() => setSelectedId(message.id)}><span className="studio-queue-item-bar" /><span className="studio-queue-item-copy"><strong>{message.name}</strong><small>{message.topic.replace('_', ' ')} · {message.email}</small><time>{formatStudioDateTime(message.created_at)}</time></span><StatusBadge status={message.status} /><ArrowRight size={14} /></button>)}</section>
        {selected && <section className="studio-detail-card" aria-labelledby="studio-inbox-detail-title">
          <div className="studio-detail-head"><div><span className="studio-panel-kicker">MESSAGE DETAIL</span><h2 id="studio-inbox-detail-title">{selected.name}</h2><p><a href={`mailto:${selected.email}`}>{selected.email}</a>{selected.phone ? ` · ${selected.phone}` : ''}</p></div><StatusBadge status={selected.status} /></div>
          <div className="studio-detail-meta"><div><span>REASON</span><strong>{selected.topic.replace('_', ' ')}</strong></div><div><span>RECEIVED</span><strong>{formatStudioDateTime(selected.created_at)}</strong></div></div>
          <div className="studio-detail-block studio-detail-block--message"><span className="studio-panel-kicker">THE QUESTION</span><p>{selected.message}</p></div>
          <div className="studio-status-actions"><span className="studio-panel-kicker">MOVE THIS MESSAGE</span><div>{['new', 'reviewing', 'replied', 'closed'].map((status) => <button key={status} className={selected.status === status ? 'is-current' : ''} type="button" disabled={saving} onClick={() => updateStatus(status)}>{status}</button>)}</div></div>
          <div className="studio-detail-footer"><a className="studio-primary-button" href={`mailto:${selected.email}?subject=${encodeURIComponent('Re: CA360 enquiry')}`}>Reply by email <ArrowRight size={15} /></a><span>Updates are saved to the shared inbox.</span></div>
          {error && <p className="studio-inline-error" role="alert">{error}</p>}{notice && <p className="studio-inline-notice" role="status">{notice}</p>}
        </section>}
      </div>}
    </StudioPage>
  );
}
