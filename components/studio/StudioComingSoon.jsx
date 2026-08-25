import { ArrowRight } from '../shared/Icons';
import { StudioPage, StudioPageHeader } from './StudioShared';

export function StudioComingSoon({ section, description }) {
  return (
    <StudioPage className="studio-coming-page">
      <StudioPageHeader kicker="BUILDING NEXT" title={<>A good room<br /><em>takes shape.</em></>} description={description} action={<a className="studio-secondary-button" href="/studio">Back to Today <ArrowRight size={14} /></a>} />
      <section className="studio-coming-card">
        <span className="studio-coming-index">{section} / NEXT LAYER</span>
        <div><strong>This space is reserved for the careful version.</strong><p>We have not turned this into a fake editor yet. The next release will add the fields, preview, publishing, and permissions this area actually needs.</p></div>
        <span className="studio-coming-rule" aria-hidden="true" />
      </section>
    </StudioPage>
  );
}
