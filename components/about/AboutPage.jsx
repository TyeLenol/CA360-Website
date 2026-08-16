import { ArrowDown, ArrowRight } from '../shared/Icons';
import { PhotoPlaceholder, Portrait } from '../shared/Placeholders';
import { RouteMarker } from '../shared/RouteMarker';

const PRINCIPLES = [
  {
    number: '01',
    title: 'Lived experience over theory.',
    body: 'Students deserve more than a polished job description. We bring in people who can talk honestly about the work, the trade-offs, and the parts nobody puts on a prospectus.',
  },
  {
    number: '02',
    title: 'Clarity before pressure.',
    body: 'The goal is not to push everyone toward the same prestigious path. It is to give each person enough context to make a choice that actually belongs to them.',
  },
  {
    number: '03',
    title: 'A room that keeps showing up.',
    body: 'One conversation can open a door. A community makes it easier to keep walking through it. CA360 is built around consistency, not one-off inspiration.',
  },
];

const PEOPLE = [
  { name: 'Dr. A. Asare', field: 'Medicine · Founder', seed: 1, tone: 'warm' },
  { name: 'Dr. K. Mensah', field: 'Medicine · Mentor', seed: 2, tone: 'teal' },
  { name: 'Akua Boateng', field: 'Medicine · Community', seed: 3, tone: 'orange' },
];

const PATHS = [
  {
    label: 'STUDENT',
    title: 'I need a clearer next step.',
    href: '/#opportunity',
    tone: 'orange',
  },
  {
    label: 'MENTOR',
    title: 'I have a path to share.',
    href: 'mailto:hello@careerarcadia360.org?subject=Mentor%20application',
    tone: 'teal',
  },
  {
    label: 'PARTNER',
    title: 'I want to make room for more people.',
    href: 'mailto:hello@careerarcadia360.org?subject=Partnership%20inquiry',
    tone: 'cream',
  },
];

export function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-hero" id="about-top">
        <div className="about-hero-inner">
          <div className="about-hero-marker" data-reveal>
            <RouteMarker index="01" label="About" context="why CA360 exists" />
          </div>
          <div className="about-hero-copy">
            <p className="about-kicker" data-reveal>THE STORY BEHIND THE ROOM</p>
            <h1 data-reveal data-reveal-delay="1">
              Built for the<br />
              <em>questions</em> after school.
            </h1>
            <p className="about-hero-lede" data-reveal data-reveal-delay="2">
              Career Arcadia 360 exists because choosing what comes next is too important to do from a distance.
            </p>
            <a className="about-hero-link" href="#about-story" data-reveal data-reveal-delay="3">
              <span>Start the story</span>
              <span className="about-hero-link-arrow"><ArrowDown color="#fff" size={14} /></span>
            </a>
          </div>
          <div className="about-hero-figure" data-reveal data-reveal-delay="2">
            <div className="about-hero-photo">
              <PhotoPlaceholder tone="orange" label="CA360 · EST. 2024" style={{ width: '100%', height: '100%' }}>
                <Portrait seed={3} bg="transparent" tone="#0a1f29" accent="#f9e7c8" />
              </PhotoPlaceholder>
            </div>
            <div className="about-hero-note">A Ghanaian mentorship organisation for the path between school and the life you are building.</div>
            <span className="about-hero-stamp" aria-hidden="true">CA<br />360</span>
          </div>
        </div>
      </section>

      <section className="about-story" id="about-story">
        <div className="about-section-index" data-reveal>
          <span>01 / WHY THIS EXISTS</span>
          <span>THE GAP</span>
        </div>
        <div className="about-story-grid">
          <h2 data-reveal>
            The hardest part is rarely the <em>application.</em>
          </h2>
          <div className="about-story-body" data-reveal data-reveal-delay="1">
            <p>
              It is the quiet uncertainty before it. The feeling that everyone else understands what a career looks like while you are trying to choose from course names, family expectations, and a few polished success stories.
            </p>
            <p>
              CA360 brings the lived version of the path closer. Students meet people who have already walked it, ask the questions they were afraid to ask, and leave with more context than they arrived with.
            </p>
            <blockquote>“You should not have to become a professional before you get to ask what the profession is really like.”</blockquote>
          </div>
        </div>
      </section>

      <section className="about-origin" id="about-origin">
        <div className="about-origin-visual" data-reveal>
          <div className="about-origin-photo">
            <PhotoPlaceholder tone="warm" label="DR. ASARE · FOUNDER" style={{ width: '100%', height: '100%' }}>
              <Portrait seed={1} bg="transparent" tone="#d68307" />
            </PhotoPlaceholder>
          </div>
          <div className="about-origin-caption">The first conversation started with a question: what would have changed if someone had explained the path sooner?</div>
        </div>
        <div className="about-origin-copy">
          <div className="about-section-index" data-reveal>
            <span>02 / THE BEGINNING</span>
            <span>FOUNDER’S NOTE</span>
          </div>
          <h2 data-reveal data-reveal-delay="1">Built by someone who needed <em>this</em> first.</h2>
          <p data-reveal data-reveal-delay="2">
            Dr. A. Asare got into medical school and realised that getting in was not the same as understanding what came after. The students who felt less lost usually had one thing in common: someone already in the field who was willing to tell the truth.
          </p>
          <p data-reveal data-reveal-delay="3">
            CA360 began in 2024 as an attempt to become that person for more students across Ghana — not by deciding their futures for them, but by making the road less abstract.
          </p>
          <div className="about-signature" data-reveal data-reveal-delay="4">
            <strong>Dr. A. Asare</strong>
            <span>Founder · Lead Mentor · Medicine</span>
          </div>
        </div>
      </section>

      <section className="about-method" id="about-how">
        <div className="about-method-head">
          <div className="about-section-index" data-reveal>
            <span>03 / HOW WE WORK</span>
            <span>THE METHOD</span>
          </div>
          <h2 data-reveal data-reveal-delay="1">Less performance.<br /><em>More proximity.</em></h2>
          <p data-reveal data-reveal-delay="2">A CA360 session is designed to move a career from an idea on a screen to a conversation with a person.</p>
        </div>
        <div className="about-principles">
          {PRINCIPLES.map((principle, index) => (
            <article className="about-principle" key={principle.number} data-reveal data-reveal-delay={index + 1}>
              <span className="about-principle-num">{principle.number}</span>
              <h3>{principle.title}</h3>
              <p>{principle.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-people" id="about-people">
        <div className="about-people-head">
          <div className="about-section-index" data-reveal>
            <span>04 / THE PEOPLE</span>
            <span>THE GUIDES</span>
          </div>
          <h2 data-reveal data-reveal-delay="1">The people behind the <em>answers.</em></h2>
          <p data-reveal data-reveal-delay="2">Mentors are not props in the story. They are the reason the story can be honest.</p>
        </div>
        <div className="about-people-grid">
          {PEOPLE.map((person, index) => (
            <article className="about-person" key={person.name} data-reveal data-reveal-delay={index + 1}>
              <div className="about-person-photo">
                <PhotoPlaceholder tone={person.tone} label={person.field} style={{ width: '100%', height: '100%' }}>
                  <Portrait seed={person.seed} bg="transparent" tone="#d68307" />
                </PhotoPlaceholder>
              </div>
              <div className="about-person-meta">
                <strong>{person.name}</strong>
                <span>{person.field}</span>
              </div>
            </article>
          ))}
        </div>
        <a className="about-people-link" href="/#mentors" data-reveal>
          Meet the wider mentor roster <ArrowRight color="#d68307" size={14} />
        </a>
      </section>

      <section className="about-proof" id="about-impact">
        <div className="about-proof-inner">
          <div className="about-proof-copy" data-reveal>
            <div className="about-section-index">
              <span>05 / SO FAR</span>
              <span>THE RECEIPT</span>
            </div>
            <h2>Small rooms can carry <em>farther</em> than they look.</h2>
            <p>Since 2024, CA360 has grown through conversations that stay with people after the session ends.</p>
          </div>
          <div className="about-stats" data-reveal data-reveal-delay="1">
            <div className="about-stat"><strong>2K+</strong><span>students reached across Ghana</span></div>
            <div className="about-stat"><strong>9/10</strong><span>average participant rating</span></div>
            <div className="about-stat"><strong>300+</strong><span>community members and growing</span></div>
          </div>
        </div>
      </section>

      <section className="about-next" id="about-next">
        <div className="about-next-head" data-reveal>
          <div className="about-section-index">
            <span>06 / YOUR PLACE IN IT</span>
            <span>KEEP SHOWING UP</span>
          </div>
          <h2>There is more than one way to <em>belong.</em></h2>
          <p>Start wherever the question is closest to you.</p>
        </div>
        <div className="about-paths">
          {PATHS.map((path, index) => (
            <a className={`about-path about-path--${path.tone}`} href={path.href} key={path.label} data-reveal data-reveal-delay={index + 1}>
              <span className="about-path-label">{path.label}</span>
              <strong>{path.title}</strong>
              <ArrowRight color={path.tone === 'orange' ? '#fff' : '#0a1f29'} size={18} />
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
