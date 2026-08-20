import { MENTORS, getTrack } from './mentors';

export const FINDER_QUESTIONS = [
  {
    id: 'stage',
    eyebrow: '01 / WHERE YOU ARE',
    title: 'Where are you in the path?',
    intro: 'You do not need a perfect plan. Choose the place that feels closest right now.',
    options: [
      { id: 'shs', label: 'I am still in SHS', note: 'I am deciding what to study or try next.', match: { stages: ['SHS student'] } },
      { id: 'recent', label: 'I recently finished SHS', note: 'I am choosing a course, field, or first direction.', match: { stages: ['Recent graduate'] } },
      { id: 'university', label: 'I am at university', note: 'I want a clearer view of the work and what comes after.', match: { stages: ['University student'] } },
      { id: 'early', label: 'I have started the work', note: 'I am thinking about my next step, confidence, or a pivot.', match: { helpWith: ['Early career questions', 'Workplace confidence', 'Housemanship realities'] } },
    ],
  },
  {
    id: 'focus',
    eyebrow: '02 / THE QUESTION',
    title: 'What are you trying to understand?',
    intro: 'Pick the question you would most want a real person to answer honestly.',
    options: [
      { id: 'fit', label: 'Whether a field is really for me', note: 'The lived reality behind the title, not just the idea of it.', match: { helpWith: ['Understanding the field', 'Choosing a course', 'The first brave question', 'Understanding engineering'] } },
      { id: 'specialised', label: 'A specialised path', note: 'What the long road, training, and trade-offs actually ask of you.', match: { helpWith: ['Specialised pathways', 'Life in a hospital', 'Child health pathways', 'Public health questions'] } },
      { id: 'study', label: 'How to prepare and study', note: 'Courses, university preparation, systems, and finding a sustainable rhythm.', match: { helpWith: ['Preparing for university', 'Study systems', 'Study habits', 'Course choices'] } },
      { id: 'voice', label: 'Confidence and the human side', note: 'Finding your voice, asking better questions, and feeling less alone in the work.', match: { helpWith: ['Finding your voice', 'Debate and confidence', 'Workplace confidence', 'Finding your pace'] } },
    ],
  },
  {
    id: 'conversation',
    eyebrow: '03 / THE FORMAT',
    title: 'What kind of conversation would help?',
    intro: 'This is about comfort and access, not a commitment. You can change your mind later.',
    options: [
      { id: 'first', label: 'A first conversation', note: 'I want a thoughtful starting point before deciding what comes next.', match: { formats: ['Introductory conversation'] } },
      { id: 'ongoing', label: 'Ongoing guidance', note: 'I would value someone to return to as the questions change.', match: { formats: ['Recurring guidance'] } },
      { id: 'online', label: 'Online is easiest', note: 'A remote conversation would make access simpler for me.', match: { formats: ['Online', 'Online or in person'] } },
      { id: 'flexible', label: 'I am flexible', note: 'Online or in person is fine; the person matters most.', match: { formats: ['Online', 'Online or in person', 'Recurring guidance'] } },
    ],
  },
  {
    id: 'track',
    eyebrow: '04 / THE DIRECTION',
    title: 'Which direction is closest?',
    intro: 'You can still choose “I am exploring” if the answer is not clear yet.',
    options: [
      { id: 'medicine', label: 'Medicine or health', note: 'From choosing the field to seeing the human reality behind care.', match: { track: 'medicine' } },
      { id: 'law', label: 'Law, voice, or argument', note: 'Confidence, debate, law school, and the many routes into the profession.', match: { track: 'law' } },
      { id: 'engineering', label: 'Engineering or building', note: 'The work, study, decisions, and human questions behind the maths.', match: { track: 'engineering' } },
      { id: 'exploring', label: 'I am still exploring', note: 'I want the person who can help me make the next question clearer.', match: { track: 'all' } },
    ],
  },
];

function hasAny(values = [], candidates = []) {
  return candidates.some((candidate) => values.includes(candidate));
}

function scoreMentor(mentor, answers) {
  const reasons = [];
  let score = 0;

  const stage = answers.stage?.match;
  if (stage?.stages && hasAny(mentor.stages, stage.stages)) {
    score += 4;
    reasons.push(`Their experience includes conversations with ${stage.stages[0].toLowerCase()}s.`);
  } else if (stage?.helpWith && hasAny(mentor.helpWith, stage.helpWith)) {
    score += 3;
    reasons.push('Their profile speaks to the questions that come with your current stage.');
  }

  const focus = answers.focus?.match;
  const focusMatches = focus?.helpWith ? mentor.helpWith.filter((item) => focus.helpWith.includes(item)) : [];
  if (focusMatches.length > 0) {
    score += 5 + Math.min(focusMatches.length - 1, 2);
    reasons.push(`They can help with ${focusMatches.slice(0, 2).join(' and ').toLowerCase()}.`);
  }

  const conversation = answers.conversation?.match;
  const formatMatches = conversation?.formats ? mentor.formats.filter((item) => conversation.formats.includes(item)) : [];
  if (formatMatches.length > 0) {
    score += 2;
    reasons.push(`Their conversation format includes ${formatMatches[0].toLowerCase()}.`);
  }

  const track = answers.track?.match?.track;
  if (track && track !== 'all' && mentor.track === track) {
    score += 5;
    reasons.push(`They are part of the ${getTrack(track)?.label || mentor.field} path.`);
  } else if (track === 'all') {
    score += 1;
    reasons.push(`Their ${mentor.specialty.toLowerCase()} perspective can help make an open question more concrete.`);
  }

  return { mentor, score, reasons: reasons.slice(0, 3) };
}

export function getFinderResults(answers) {
  const ranked = MENTORS
    .map((mentor) => scoreMentor(mentor, answers))
    .sort((a, b) => b.score - a.score || MENTORS.indexOf(a.mentor) - MENTORS.indexOf(b.mentor));

  const lead = ranked[0];
  const second = ranked[1];
  const selected = second && second.score >= lead.score - 2 ? [lead, second] : [lead];
  return { ranked, selected };
}
