import { MentorshipPage } from '../../components/mentorship/MentorshipPage';
import { getPublicMentors } from '../../lib/public-content';

// Keep mentor roster changes visible immediately during Studio testing.
export const revalidate = 0;

export const metadata = {
  title: 'Mentorship · Career Arcadia 360',
  description: 'Meet the people behind the next version of you. Explore CA360 mentors and request a thoughtful introduction.',
};

export default async function MentorshipRoute() {
  const mentors = await getPublicMentors();
  return <MentorshipPage initialMentors={mentors} />;
}
