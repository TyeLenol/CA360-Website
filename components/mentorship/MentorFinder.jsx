'use client';

import { useMemo, useState } from 'react';
import { ArrowRight } from '../shared/Icons';
import { PhotoPlaceholder, Portrait } from '../shared/Placeholders';
import { FINDER_QUESTIONS, getFinderResults } from '../../data/mentor-finder';

function FinderPortrait({ mentor }) {
  return (
    <PhotoPlaceholder
      tone={mentor.tone}
      label={`MENTOR · ${mentor.specialty.toUpperCase()}`}
      style={{ width: '100%', height: '100%' }}
    >
      <Portrait seed={mentor.seed} bg="transparent" tone="#d68307" />
    </PhotoPlaceholder>
  );
}

function Progress({ step, onBack, onRestart }) {
  const isResults = step >= FINDER_QUESTIONS.length;
  return (
    <div className="mf-progress-wrap">
      <div className="mf-progress-topline">
        <span>{isResults ? 'YOUR STARTING POINT' : `QUESTION ${String(step + 1).padStart(2, '0')} / ${String(FINDER_QUESTIONS.length).padStart(2, '0')}`}</span>
        <span>{isResults ? 'RECOMMENDATIONS' : 'CHOOSE ONE'}</span>
      </div>
      <div className="mf-progress-track" aria-hidden="true">
        <span style={{ width: `${isResults ? 100 : (step / FINDER_QUESTIONS.length) * 100}%` }} />
      </div>
      <div className="mf-progress-actions">
        {step > 0 && <button type="button" className="mf-quiet-button" onClick={onBack}><ArrowRight size={13} style={{ transform: 'rotate(180deg)' }} /> Previous</button>}
        {step > 0 && <button type="button" className="mf-quiet-button" onClick={onRestart}>Start over</button>}
      </div>
    </div>
  );
}

function FinderQuestion({ question, selectedId, onChoose }) {
  return (
    <section className="mf-question" aria-labelledby={`mf-question-${question.id}`}>
      <div className="mf-question-head">
        <span className="mf-question-eyebrow">{question.eyebrow.split(' / ').pop()}</span>
        <h2 id={`mf-question-${question.id}`}>{question.title}</h2>
        <p>{question.intro}</p>
      </div>
      <fieldset className="mf-options">
        <legend className="sr-only">{question.title}</legend>
        {question.options.map((option, index) => (
          <button
            type="button"
            className={`mf-option${selectedId === option.id ? ' is-selected' : ''}`}
            aria-pressed={selectedId === option.id}
            onClick={() => onChoose(question, option)}
            key={option.id}
          >
            <span className="mf-option-index">0{index + 1}</span>
            <span className="mf-option-copy"><strong>{option.label}</strong><small>{option.note}</small></span>
            <span className="mf-option-arrow" aria-hidden="true"><ArrowRight color="currentColor" size={16} /></span>
          </button>
        ))}
      </fieldset>
    </section>
  );
}

function RecommendationCard({ result, index, answers }) {
  const { mentor, reasons } = result;
  const pathAnswer = answers.track?.label;
  return (
    <article className={`mf-result-card${index === 0 ? ' is-primary' : ''}`}>
      <div className="mf-result-media"><FinderPortrait mentor={mentor} /><span className="mf-result-index">{index === 0 ? 'CLOSEST FIT' : 'ALSO WORTH A LOOK'}</span></div>
      <div className="mf-result-copy">
        <div className="mf-result-meta">{mentor.specialty} · {mentor.role}</div>
        <h3>{mentor.name}</h3>
        <p className="mf-result-positioning">{mentor.positioning}</p>
        <div className="mf-why">
          <span>WHY THIS PERSON</span>
          <p>{pathAnswer ? `You chose ${pathAnswer.toLowerCase()}. ` : ''}{reasons.join(' ')}</p>
        </div>
        <div className="mf-result-actions">
          <a className="btn btn-primary" href={`/contact?type=student&mentor=${mentor.slug}`}>Request an introduction <ArrowRight color="#0a1f29" size={14} /></a>
          <a className="mf-result-link" href={`/mentorship/${mentor.slug}`}>Read the full profile <ArrowRight color="currentColor" size={14} /></a>
        </div>
      </div>
    </article>
  );
}

function FinderResults({ answers, onRestart }) {
  const { selected } = useMemo(() => getFinderResults(answers), [answers]);
  return (
    <section className="mf-results" aria-labelledby="mf-results-title" aria-live="polite">
      <div className="mf-results-head">
        <div>
          <span className="mf-question-eyebrow">YOUR ANSWERS, READ BACK</span>
          <h2 id="mf-results-title">Here is where we would <em>start.</em></h2>
          <p>This is a thoughtful first recommendation, not an automated match or a promise of availability. CA360 still confirms the right next step with you.</p>
        </div>
        <div className="mf-answer-summary">
          {FINDER_QUESTIONS.map((question) => <span key={question.id}><small>{question.eyebrow.split(' / ')[1]}</small><strong>{answers[question.id]?.label}</strong></span>)}
        </div>
      </div>
      <div className="mf-result-list">
        {selected.map((result, index) => <RecommendationCard result={result} index={index} answers={answers} key={result.mentor.slug} />)}
      </div>
      <div className="mf-results-footer">
        <p>Not feeling seen by these suggestions? You can browse everyone, start again, or tell CA360 what the finder could not capture.</p>
        <div>
          <button className="mf-quiet-button mf-quiet-button-dark" type="button" onClick={onRestart}>Try another set of answers <ArrowRight size={13} /></button>
          <a className="mf-quiet-button mf-quiet-button-dark" href="/mentorship">Browse all mentors <ArrowRight size={13} /></a>
          <a className="mf-quiet-button mf-quiet-button-dark" href="/contact?type=student">Tell CA360 directly <ArrowRight size={13} /></a>
        </div>
      </div>
    </section>
  );
}

export default function MentorFinder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const restart = () => {
    setAnswers({});
    setStep(0);
    window.requestAnimationFrame(() => document.getElementById('mf-finder')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const choose = (question, option) => {
    setAnswers((current) => {
      const next = { ...current, [question.id]: option };
      const questionIndex = FINDER_QUESTIONS.findIndex((item) => item.id === question.id);
      FINDER_QUESTIONS.slice(questionIndex + 1).forEach((item) => delete next[item.id]);
      return next;
    });
    setStep((current) => current + 1);
    window.requestAnimationFrame(() => document.getElementById('mf-finder')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const goBack = () => {
    setStep((current) => Math.max(0, current - 1));
    window.requestAnimationFrame(() => document.getElementById('mf-finder')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  return (
    <main className="mentor-finder-page">
      <section className="mf-shell" id="mf-finder">
        <Progress step={step} onBack={goBack} onRestart={restart} />
        {step < FINDER_QUESTIONS.length ? (
          <FinderQuestion question={FINDER_QUESTIONS[step]} selectedId={answers[FINDER_QUESTIONS[step].id]?.id} onChoose={choose} />
        ) : (
          <FinderResults answers={answers} onRestart={restart} />
        )}
      </section>
    </main>
  );
}
