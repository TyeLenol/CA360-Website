import { Hero } from '../components/sections/Hero';
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

export const metadata = {
  title: 'Career Arcadia 360 — Mentorship that shows up',
  description: 'Real guidance. Real mentors. Real clarity — for SHS graduates stepping into medicine, law, engineering and business.',
};

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Mission />
      <Origin />
      <Fields />
      <Programs />
      <Gain />
      <Mentors />
      <Impact />
      <Sessions />
      <JoinIn />
      <Newsletter />
      <FAQ />
    </main>
  );
}
