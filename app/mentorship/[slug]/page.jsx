import { notFound } from 'next/navigation';
import { MentorProfilePage } from '../../../components/mentorship/MentorshipPage';
import { getMentor, MENTORS } from '../../../data/mentors';

export function generateStaticParams() {
  return MENTORS.map((mentor) => ({ slug: mentor.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const mentor = getMentor(slug);
  if (!mentor) return { title: 'Mentor profile · Career Arcadia 360' };
  return {
    title: `${mentor.name} · Mentorship · Career Arcadia 360`,
    description: `${mentor.positioning} Read ${mentor.name}'s CA360 mentor profile and request a thoughtful introduction.`,
  };
}

export default async function MentorProfileRoute({ params }) {
  const { slug } = await params;
  const mentor = getMentor(slug);
  if (!mentor) notFound();
  return <MentorProfilePage mentorSlug={mentor.slug} />;
}
