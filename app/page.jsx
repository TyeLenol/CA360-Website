import { Hero } from '../components/sections/Hero';
import { CurrentOpportunity } from '../components/sections/CurrentOpportunity';
import { Mission } from '../components/sections/Mission';
import { Origin } from '../components/sections/Origin';
import { Fields } from '../components/sections/Fields';
import { Programs } from '../components/sections/Programs';
import { Gain } from '../components/sections/Gain';
import { Mentors } from '../components/sections/Mentors';
import { Impact } from '../components/sections/Impact';
import { Sessions } from '../components/sections/Sessions';
import { JoinIn } from '../components/sections/JoinIn';
import { Newsletter } from '../components/sections/Newsletter';
import { FAQ } from '../components/sections/FAQ';
import { getPublicMentors, getPublicSessions } from '../lib/public-content';

// Live mentor and session data should be immediately testable while Studio is being populated.
export const revalidate = 0;

export const metadata = {
  title: 'Mentorship that shows up',
  description: 'Real guidance. Real mentors. Real clarity — for SHS graduates stepping into medicine, law, engineering and business.',
};

export default async function HomePage() {
  const [liveMentors, liveSessions] = await Promise.all([getPublicMentors(), getPublicSessions()]);
  return (
    <main>
      <Hero />
      <CurrentOpportunity />
      <Mission />
      <Origin />
      <Fields />
      <Programs />
      <Gain />
      <Mentors initialMentors={liveMentors} />
      <Impact />
      <Sessions initialSessions={liveSessions} />
      <JoinIn />
      <Newsletter />
      <FAQ />
    </main>
  );
}
