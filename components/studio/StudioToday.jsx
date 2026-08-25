'use client';

import { useEffect, useState } from 'react';
import { ArrowRight } from '../shared/Icons';
import { createSupabaseBrowserClient } from '../../lib/supabase/client';
import { ErrorState, formatStudioDate, LoadingState, StatusBadge, StudioLinkAction, StudioPage, StudioPageHeader } from './StudioShared';

const supabase = createSupabaseBrowserClient();

export function StudioToday() {
  const [data, setData] = useState({ requests: [], messages: [], sessions: [], counts: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      const [requestsResult, messagesResult, sessionsResult, requestCount, messageCount, mentorCount, sessionCount] = await Promise.all([
        supabase.from('mentor_requests').select('id, name, field_interest, status, created_at, matched_mentor_id').order('created_at', { ascending: false }).limit(6),
        supabase.from('contact_messages').select('id, name, topic, status, created_at').order('created_at', { ascending: false }).limit(6),
        supabase.from('sessions').select('id, title, status, starts_at, venue').order('starts_at', { ascending: true, nullsFirst: false }).limit(5),
        supabase.from('mentor_requests').select('id', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('mentors').select('id', { count: 'exact', head: true }).eq('is_public', true).eq('status', 'active'),
        supabase.from('sessions').select('id', { count: 'exact', head: true }).in('status', ['draft', 'open']),
      ]);
      if (!active) return;
      const firstError = [requestsResult, messagesResult, sessionsResult].find((result) => result.error)?.error;
      if (firstError) setError('The Studio could not load its live queue. Check your access and try again.');
      setData({
        requests: requestsResult.data || [],
        messages: messagesResult.data || [],
        sessions: sessionsResult.data || [],
        counts: {
          newRequests: requestCount.count || 0,
          newMessages: messageCount.count || 0,
          activeMentors: mentorCount.count || 0,
          liveSessions: sessionCount.count || 0,
        },
      });
      setLoading(false);
    }
    load();
    return () => { active = false; };
  }, []);

  if (loading) return <StudioPage><LoadingState /></StudioPage>;
  if (error) return <StudioPage><ErrorState message={error} /></StudioPage>;

  return (
    <StudioPage>
      <StudioPageHeader
        kicker="GOOD MORNING / TODAY"
        title={<>Keep the next<br /><em>door visible.</em></>}
        description="A short view of what needs care now, what is coming up, and where a useful action is waiting."
        action={<a className="studio-primary-button" href="/studio/requests">Review requests <ArrowRight size={15} /></a>}
      />

      <section className="studio-stat-grid" aria-label="Studio overview">
        <div className="studio-stat-card studio-stat-card--accent"><span>NEW REQUESTS</span><strong>{data.counts.newRequests}</strong><small>Waiting for a thoughtful first look</small></div>
        <div className="studio-stat-card"><span>INBOX TO READ</span><strong>{data.counts.newMessages}</strong><small>Contact messages not yet opened</small></div>
        <div className="studio-stat-card"><span>PUBLIC MENTORS</span><strong>{data.counts.activeMentors}</strong><small>Showing in the public index</small></div>
        <div className="studio-stat-card"><span>LIVE SESSION RECORDS</span><strong>{data.counts.liveSessions}</strong><small>Drafts or open sessions</small></div>
      </section>

      <div className="studio-dashboard-grid">
        <section className="studio-panel studio-panel--large" aria-labelledby="studio-requests-title">
          <div className="studio-panel-head"><div><span className="studio-panel-kicker">THE HUMAN QUEUE</span><h2 id="studio-requests-title">Requests needing a look.</h2></div><StudioLinkAction href="/studio/requests">All requests</StudioLinkAction></div>
          {data.requests.length ? <div className="studio-list">{data.requests.map((request) => <a className="studio-list-row" href="/studio/requests" key={request.id}><span className="studio-list-index" aria-hidden="true">↗</span><span className="studio-list-main"><strong>{request.name}</strong><small>{request.field_interest || 'Career question'} · {formatStudioDate(request.created_at)}</small></span><StatusBadge status={request.status} /><ArrowRight size={14} /></a>)}</div> : <div className="studio-inline-empty">No mentor requests are waiting. That is a good quiet moment.</div>}
        </section>

        <section className="studio-panel" aria-labelledby="studio-inbox-title">
          <div className="studio-panel-head"><div><span className="studio-panel-kicker">THE OPEN DOOR</span><h2 id="studio-inbox-title">Inbox.</h2></div><StudioLinkAction href="/studio/inbox">Open inbox</StudioLinkAction></div>
          {data.messages.length ? <div className="studio-list studio-list--compact">{data.messages.slice(0, 4).map((message) => <a className="studio-list-row" href="/studio/inbox" key={message.id}><span className="studio-list-main"><strong>{message.name}</strong><small>{message.topic.replace('_', ' ')} · {formatStudioDate(message.created_at)}</small></span><StatusBadge status={message.status} /><ArrowRight size={14} /></a>)}</div> : <div className="studio-inline-empty">The inbox is clear for now.</div>}
        </section>

        <section className="studio-panel" aria-labelledby="studio-sessions-title">
          <div className="studio-panel-head"><div><span className="studio-panel-kicker">ON THE HORIZON</span><h2 id="studio-sessions-title">Sessions.</h2></div><StudioLinkAction href="/studio/sessions">Manage sessions</StudioLinkAction></div>
          {data.sessions.length ? <div className="studio-list studio-list--compact">{data.sessions.slice(0, 4).map((session) => <a className="studio-list-row" href="/studio/sessions" key={session.id}><span className="studio-list-main"><strong>{session.title}</strong><small>{session.starts_at ? formatStudioDate(session.starts_at) : 'No date yet'} · {session.venue || session.status.replace('_', ' ')}</small></span><StatusBadge status={session.status} /><ArrowRight size={14} /></a>)}</div> : <div className="studio-inline-empty">No upcoming session records yet. Start with a draft.</div>}
        </section>
      </div>

      <section className="studio-next-strip" aria-label="Studio coming next"><span className="studio-panel-kicker">BUILDING NEXT</span><strong>Journal, site content, and media will join this room after the operational queue is settled.</strong><a href="/" target="_blank" rel="noreferrer">See the public expression <ArrowRight size={14} /></a></section>
    </StudioPage>
  );
}
