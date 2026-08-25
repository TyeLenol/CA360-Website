import { MentorshipPage } from '../../components/mentorship/MentorshipPage';
import { getPublicMentors } from '../../lib/public-content';

export const revalidate = 60;

export const metadata = {
  title: 'Mentorship · Career Arcadia 360',
  description: 'Meet the people behind the next version of you. Explore CA360 mentors and request a thoughtful introduction.',
};

export default async function MentorshipRoute() {
  const mentors = await getPublicMentors();
  return <MentorshipPage initialMentors={mentors} />;
}
