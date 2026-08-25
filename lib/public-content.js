import { createClient } from '@supabase/supabase-js';
import { MENTORS, MENTOR_TRACKS } from '../data/mentors';
import { JOURNAL_ARTICLES } from '../data/journal';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }) : null;

const TONES = ['warm', 'teal', 'orange', 'deep', 'soft'];
const TRACK_IDS = new Set(MENTOR_TRACKS.map((track) => track.id));

function getTrackId(field = '') {
  const value = field.toLowerCase().trim();
  const match = [...TRACK_IDS].find((track) => value.includes(track));
  return match || 'medicine';
}

function getStableSeed(slug = '') {
  return slug.split('').reduce((total, character) => total + character.charCodeAt(0), 0) % 9 || 1;
}

function statusLabel(status) {
  if (status === 'active') return 'ACTIVE ROSTER';
  if (status === 'paused') return 'PAUSED';
  return 'APPLICATION ONLY';
}

function mapMentor(row, specialtiesByMentor) {
  const fallback = MENTORS.find((mentor) => mentor.slug === row.slug) || {};
  const specialties = specialtiesByMentor.get(row.id) || [];
  const field = row.field || fallback.field || 'Career guidance';
  return {
    ...fallback,
    id: row.id,
    slug: row.slug,
    name: row.name,
    field,
    specialty: specialties[0] || fallback.specialty || field,
    track: getTrackId(field),
    tone: fallback.tone || TONES[getStableSeed(row.slug) % TONES.length],
    seed: fallback.seed || getStableSeed(row.slug),
    role: row.role_label || fallback.role || 'CA360 mentor',
    status: row.status || fallback.status || 'active',
    statusLabel: statusLabel(row.status || fallback.status),
    positioning: row.positioning || fallback.positioning || 'A thoughtful starting point for your next useful question.',
    helpWith: fallback.helpWith || specialties,
    stages: fallback.stages || ['SHS student', 'Recent graduate', 'University student'],
    formats: fallback.formats || ['Introductory conversation', 'Online'],
    path: row.path_summary || fallback.path || 'A lived path shared with care, context, and room for questions.',
    quote: row.quote || fallback.quote || 'You do not have to figure out the next step alone.',
    firstQuestion: fallback.firstQuestion || 'What would you like to understand better?',
    firstConversation: fallback.firstConversation || 'Start with the question that has been sitting there. The next step can be small and still be useful.',
    boundary: fallback.boundary || 'Mentorship is guidance and lived experience, not a guarantee of a particular outcome.',
    isPublic: row.is_public,
    acceptingRequests: row.accepting_requests,
    imageUrl: row.image_url || fallback.imageUrl || '',
  };
}

export async function getPublicMentors() {
  if (!supabase) return MENTORS;
  const { data, error } = await supabase
    .from('mentors')
    .select('id, slug, name, role_label, positioning, path_summary, quote, field, status, is_public, accepting_requests, image_url')
    .order('name', { ascending: true })
    .limit(100);
  if (error || !data?.length) return MENTORS;

  const ids = data.map((mentor) => mentor.id);
  const { data: specialtyRows } = await supabase
    .from('mentor_specialties')
    .select('mentor_id, specialty')
    .in('mentor_id', ids)
    .order('specialty', { ascending: true })
    .limit(300);
  const specialtiesByMentor = new Map();
  (specialtyRows || []).forEach((row) => {
    const list = specialtiesByMentor.get(row.mentor_id) || [];
    list.push(row.specialty);
    specialtiesByMentor.set(row.mentor_id, list);
  });
  const legacyOrder = new Map(MENTORS.map((mentor, index) => [mentor.slug, index]));
  data.sort((left, right) => {
    const leftOrder = legacyOrder.has(left.slug) ? legacyOrder.get(left.slug) : Number.MAX_SAFE_INTEGER;
    const rightOrder = legacyOrder.has(right.slug) ? legacyOrder.get(right.slug) : Number.MAX_SAFE_INTEGER;
    return leftOrder - rightOrder || left.name.localeCompare(right.name);
  });
  return data.map((row) => mapMentor(row, specialtiesByMentor));
}

export async function getPublicSiteContent(key) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('site_content')
    .select('key, content, status, is_public, updated_at')
    .eq('key', key)
    .eq('is_public', true)
    .eq('status', 'published')
    .limit(1)
    .maybeSingle();
  return error || !data?.content ? null : data.content;
}

export async function getPublicFaqs() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('site_faqs')
    .select('id, slug, category, question, answer, sort_order')
    .eq('is_public', true)
    .eq('status', 'published')
    .order('sort_order', { ascending: true })
    .limit(100);
  if (error || !data?.length) return null;
  return data.map((row) => ({ id: row.slug || row.id, q: row.question, a: row.answer, cat: row.category }));
}

export async function getPublicJournalArticles() {
  if (!supabase) return JOURNAL_ARTICLES;
  const { data, error } = await supabase
    .from('journal_articles')
    .select('id, slug, title, excerpt, body, category, category_label, author, author_role, author_seed, published_at, read_time, tone, label, featured, cover_url')
    .eq('is_public', true)
    .eq('status', 'published')
    .order('featured', { ascending: false })
    .order('published_at', { ascending: false })
    .limit(100);
  if (error || !data?.length) return JOURNAL_ARTICLES;
  return data.map((row) => ({
    id: row.slug || row.id,
    featured: row.featured,
    cat: row.category,
    catLabel: row.category_label,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body || row.excerpt,
    author: row.author,
    authorSeed: row.author_seed || 1,
    authorRole: row.author_role || 'CA360 Editorial',
    date: row.published_at ? new Intl.DateTimeFormat('en-GH', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${row.published_at}T00:00:00Z`)).toUpperCase() : 'DATE TBC',
    publishedAt: row.published_at,
    readTime: row.read_time,
    tone: row.tone,
    label: row.label,
    coverUrl: row.cover_url || '',
  }));
}

export async function getPublicSessions() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('sessions')
    .select('id, slug, title, summary, field, format, venue, starts_at, ends_at, category, duration_minutes, attendee_count, status, is_public')
    .eq('is_public', true)
    .in('status', ['open', 'completed'])
    .order('starts_at', { ascending: false, nullsFirst: false })
    .limit(20);
  if (error || !data?.length) return null;
  return data.map((row, index) => ({
    id: row.slug || row.id,
    num: String(data.length - index).padStart(2, '0'),
    date: row.starts_at ? new Intl.DateTimeFormat('en-GH', { month: 'short', year: 'numeric' }).format(new Date(row.starts_at)).toUpperCase() : 'DATE TBC',
    cat: row.category || row.field || 'CA360 SESSION',
    tone: TONES[index % TONES.length],
    title: row.title,
    body: row.summary,
    venue: row.venue || (row.format === 'online' ? 'Online · CA360 room' : 'Venue to be confirmed'),
    duration: row.duration_minutes ? `${row.duration_minutes} min · ${row.format.replace('_', ' ')}` : row.format.replace('_', ' '),
    attendees: row.attendee_count || 0,
  }));
}
