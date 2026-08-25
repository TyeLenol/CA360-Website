import { JournalPage } from '../../components/journal/JournalPage';
import { getPublicJournalArticles } from '../../lib/public-content';

export const revalidate = 0;

export const metadata = {
  title: 'Journal',
  description: 'A journal on mentorship, medicine, and the life after SHS. Session recaps, mentor stories, career guides.',
};

export default async function JournalRoute() {
  const articles = await getPublicJournalArticles();
  return <JournalPage initialArticles={articles} />;
}
