import MentorFinder from '../../../components/mentorship/MentorFinder';
import { getPublicMentors } from '../../../lib/public-content';

export const metadata = {
  title: 'Find a mentor · Mentorship · Career Arcadia 360',
  description: 'Answer a few questions and see which CA360 mentors could be a useful starting point for your career question.',
};

export default async function MentorFinderRoute() {
  const mentors = await getPublicMentors();
  return <MentorFinder initialMentors={mentors} />;
}
