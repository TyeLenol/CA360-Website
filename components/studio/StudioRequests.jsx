'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from '../shared/Icons';
import { createSupabaseBrowserClient } from '../../lib/supabase/client';
import { EmptyState, ErrorState, formatStudioDateTime, LoadingState, StatusBadge, StudioPage, StudioPageHeader } from './StudioShared';

const supabase = createSupabaseBrowserClient();
const FILTERS = [
  { value: 'all', label: 'All requests' },
  { value: 'new', label: 'New' },
  { value: 'reviewing', label: 'Reviewing' },
  { value: 'matched', label: 'Matched' },
  { value: 'closed', label: 'Closed' },
];

export function StudioRequests() {
  const [requests, setRequests] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [activity, setActivity] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [filter, setFilter] = useState('all');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = async () => {
    setLoading(true);
    const [requestResult, mentorResult] = await Promise.all([
      supabase.from('mentor_requests').select('id, name, email, institution, year_label, field_interest, goals, matching_answers, recommendation_reason, status, created_at, updated_at, preferred_mentor_id, matched_mentor_id').order('created_at', { ascending: false }).limit(100),
      supabase.from('mentors').select('id, name, slug, field, role_label, accepting_requests').order('name', { ascending: true }).limit(100),
    ]);
    if (requestResult.error || mentorResult.error) setError('Requests could not be loaded. Check your Studio access and try again.');
    setRequests(requestResult.data || []);
    setMentors(mentorResult.data || []);
    setSelectedId((current) => current || requestResult.data?.[0]?.id || '');
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const visibleRequests = useMemo(() => filter === 'all' ? requests : requests.filter((request) => request.status === filter), [filter, requests]);
  const selected = requests.find((request) => request.id === selectedId) || visibleRequests[0];
  const selectedMentor = mentors.find((mentor) => mentor.id === selected?.matched_mentor_id) || mentors.find((mentor) => mentor.id === selected?.preferred_mentor_id);

  useEffect(() => {
    if (!selected?.id) return;
    let active = true;
    supabase.from('request_activity').select('id, activity_type, body, created_at, actor_user_id').eq('request_id', selected.id).order('created_at', { ascending: false }).limit(30).then(({ data }) => {
      if (active) setActivity(data || []);
    });
    return () => { active = false; };
  }, [selected?.id]);

  const updateStatus = async (status) => {
    if (!selected) return;
    setSaving(true);
    setNotice('');
    const { error: updateError } = await supabase.from('mentor_requests').update({ status }).eq('id', selected.id);
    if (updateError) setError('That status could not be saved.');
    else {
      setRequests((current) => current.map((request) => request.id === selected.id ? { ...request, status } : request));
      setNotice('Request status updated.');
    }
    setSaving(false);
  };

  const addNote = async (event) => {
    event.preventDefault();
    if (!selected || !note.trim()) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error: insertError } = await supabase.from('request_activity').insert({ request_id: selected.id, actor_user_id: user?.id, activity_type: 'note', body: note.trim() });
    if (insertError) setError('The note could not be saved.');
    else {
      setNote('');
      setNotice('Private note added.');
      const { data } = await supabase.from('request_activity').select('id, activity_type, body, created_at, actor_user_id').eq('request_id', selected.id).order('created_at', { ascending: false }).limit(30);
      setActivity(data || []);
    }
    setSaving(false);
  };

  if (loading) return <StudioPage><LoadingState label="Loading requests…" /></StudioPage>;
  if (error && !requests.length) return <StudioPage><ErrorState message={error} /></StudioPage>;

  return (
    <StudioPage className="studio-queue-page">
      <StudioPageHeader kicker="THE HUMAN QUEUE" title={<>Requests, with<br /><em>care.</em></>} description="A student’s first question should never disappear into a crowded inbox. Move each request to its next useful step." action={<span className="studio-count-note">{requests.length} total records</span>} />
      <div className="studio-filter-row" role="group" aria-label="Filter mentor requests">{FILTERS.map((item) => <button key={item.value} className={filter === item.value ? 'is-active' : ''} type="button" onClick={() => setFilter(item.value)}>{item.label}<span>{item.value === 'all' ? requests.length : requests.filter((request) => request.status === item.value).length}</span></button>)}</div>

      {visibleRequests.length === 0 ? <EmptyState title="No requests in this view." description={filter === 'all' ? 'The queue is clear. That is a good quiet moment.' : 'Try another status filter to find the next conversation.'} /> : <div className="studio-split-layout">
        <section className="studio-queue-list" aria-label="Mentor request list">{visibleRequests.map((request) => <button key={request.id} type="button" className={`studio-queue-item${request.id === selected?.id ? ' is-selected' : ''}`} onClick={() => setSelectedId(request.id)}><span className="studio-queue-item-bar" /><span className="studio-queue-item-copy"><strong>{request.name}</strong><small>{request.field_interest || 'Career question'}{request.institution ? ` · ${request.institution}` : ''}</small><time>{formatStudioDateTime(request.created_at)}</time></span><StatusBadge status={request.status} /><ArrowRight size={14} /></button>)}</section>
        {selected && <section className="studio-detail-card" aria-labelledby="studio-request-detail-title">
          <div className="studio-detail-head"><div><span className="studio-panel-kicker">REQUEST DETAIL</span><h2 id="studio-request-detail-title">{selected.name}</h2><p>{selected.email}{selected.year_label ? ` · ${selected.year_label}` : ''}</p></div><StatusBadge status={selected.status} /></div>
          <div className="studio-detail-meta"><div><span>FIELD OF INTEREST</span><strong>{selected.field_interest || 'Not specified'}</strong></div><div><span>REFERRED MENTOR</span><strong>{selectedMentor ? `${selectedMentor.name} · ${selectedMentor.field}` : 'CA360 to recommend'}</strong></div></div>
          <div className="studio-detail-block"><span className="studio-panel-kicker">WHAT THEY WANT HELP WITH</span><p>{selected.goals}</p></div>
          {selected.recommendation_reason && <div className="studio-detail-callout"><span className="studio-panel-kicker">MATCHING NOTE</span><p>{selected.recommendation_reason}</p></div>}
          <div className="studio-status-actions"><span className="studio-panel-kicker">MOVE THIS REQUEST</span><div>{['new', 'reviewing', 'matched', 'closed'].map((status) => <button key={status} className={selected.status === status ? 'is-current' : ''} type="button" disabled={saving} onClick={() => updateStatus(status)}>{status.replace('_', ' ')}</button>)}</div></div>
          <div className="studio-detail-activity"><div className="studio-panel-head"><div><span className="studio-panel-kicker">PRIVATE TIMELINE</span><h3>Notes for the team.</h3></div><span>{activity.length} entries</span></div>{activity.length ? <div className="studio-activity-list">{activity.map((entry) => <div className="studio-activity-item" key={entry.id}><span className="studio-activity-dot" /><div><p>{entry.body}</p><small>{entry.activity_type} · {formatStudioDateTime(entry.created_at)}</small></div></div>)}</div> : <p className="studio-inline-empty">No notes yet. Add the context that will help the next person pick this up well.</p>}<form className="studio-note-form" onSubmit={addNote}><label className="sr-only" htmlFor="studio-request-note">Add a private note</label><textarea id="studio-request-note" rows="3" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add a private note for the team…" /><button type="submit" disabled={saving || !note.trim()}>Add note <ArrowRight size={14} /></button></form></div>
          {error && <p className="studio-inline-error" role="alert">{error}</p>}{notice && <p className="studio-inline-notice" role="status">{notice}</p>}
        </section>}
      </div>}
    </StudioPage>
  );
}
