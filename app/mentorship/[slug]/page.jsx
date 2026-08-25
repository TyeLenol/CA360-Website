import { notFound } from 'next/navigation';
import { MentorProfilePage } from '../../../components/mentorship/MentorshipPage';
import { getMentor, MENTORS } from '../../../data/mentors';
import { getPublicMentors } from '../../../lib/public-content';

// Keep individual mentor edits visible immediately during Studio testing.
export const revalidate = 0;

export function generateStaticParams() {
  return MENTORS.map((mentor) => ({ slug: mentor.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const mentors = await getPublicMentors();
  const mentor = mentors.find((item) => item.slug === slug) || getMentor(slug);
  if (!mentor) return { title: 'Mentor profile · Career Arcadia 360' };
  return {
    title: `${mentor.name} · Mentorship · Career Arcadia 360`,
    description: `${mentor.positioning} Read ${mentor.name}'s CA360 mentor profile and request a thoughtful introduction.`,
  };
}

export default async function MentorProfileRoute({ params }) {
  const { slug } = await params;
  const mentors = await getPublicMentors();
  const mentor = mentors.find((item) => item.slug === slug) || getMentor(slug);
  if (!mentor) notFound();
  return <MentorProfilePage mentorSlug={mentor.slug} initialMentor={mentor} initialMentors={mentors} />;
}
