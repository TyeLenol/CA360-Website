# CA360 Homepage Retention Blueprint

## The blunt answer

The homepage does **not** need to become calmer or less creative. The client is right that the visual overload is part of the point. The site already has attention. The missing layer is what happens **after attention**.

Right now, the homepage is strong at making someone say, “This is visually interesting.” It is weaker at making them say, “I know exactly what I can do here, I trust what will happen next, and I have a reason to come back.”

> **Creative overload wins the first few seconds. Clear value, visible activity, and a reliable next step make people stay.**

The real task is not to reduce creativity. It is to add a clean utility layer underneath the creativity.

## What must actually be done

### 1. Give the hero a real next action, not only an attractive promise

The hero currently says “Attend a session,” but the live destination is the newsletter area. That is a mismatch between label and result. A student who clicks because they want to attend should see the next available session, its date, format, topic, location or platform, and a direct reservation or registration action.

The hero should keep the creative composition, but the CTA copy needs to become operational. Use language such as **“Reserve a seat for the next session”** or **“See the next Medicine session.”** If there is no upcoming session, say that honestly and offer a waitlist or monthly-letter signup as the fallback.

### 2. Add a visible “what is happening now?” module immediately after the hero

The page currently contains campaign language such as “Cohort 06 open,” but the visitor does not immediately receive the practical details that make “open” meaningful. Add a compact current-status module directly below the hero or inside the first scroll transition.

| Required information | Why it matters |
|---|---|
| Next event or current cohort | Gives the visitor a reason to act now |
| Date and time | Converts vague interest into a real decision |
| Topic or field | Helps students judge relevance |
| Format and location | Removes uncertainty |
| Who it is for | Prevents audience confusion |
| One action button | Creates a clear conversion path |

This module can still be highly art-directed. The content needs to be simple even if the container is expressive.

### 3. Add an audience choice before the page asks for too much attention

The homepage serves students, mentors, and partners. At the moment, all three audiences are woven through a very long narrative. That is inclusive, but it makes the user work to identify their path.

Add a small **“I’m here to…”** choice after the hero or mission section:

| Audience | Immediate path |
|---|---|
| Student | See the next session and join the student list |
| Mentor | Understand the commitment and apply |
| School or partner | Request a school session or partnership conversation |

This is not a visual simplification. It is a way to make the existing complexity legible.

### 4. Build a continuous CTA chain through the page

The page currently has many individual CTAs, but they do not always form a coherent journey. Each major section should answer: **What did I just learn, and what should I do next?**

A stronger chain would be:

| Section | User learns | Next action |
|---|---|---|
| Hero | CA360 gives students real career guidance | See the next session |
| Mission | Why the organization exists | Meet the mentors |
| Programs | How the support works | Choose student, mentor, or partner path |
| Mentors | Who provides the guidance | Read a mentor story or apply |
| Impact | Evidence that the work exists | See the latest session or testimonial |
| Sessions | What actually happened | Read the full recap |
| Join In | How to participate | Complete the relevant action |
| Newsletter | How to stay connected | Subscribe for the next update |

The current page has most of these sections. The missing work is connecting them as a deliberate sequence rather than treating each as a separate visual moment.

### 5. Make every click resolve to the exact promise

This is the highest-priority functional issue.

The session cards currently use targets such as `/journal#s5`, but the journal does not contain matching `s5` elements. The link opens the journal but does not land on the chosen session. That makes the site feel unfinished immediately after a high-intent click.

The fix is simple: either create real session detail routes such as `/journal/session-05` or map each homepage session card to an existing article target. Do not use a generic journal landing page when the button says **“Read the recap.”**

The same rule applies to every major CTA. “Become a mentor” should open a mentor application, not merely an email if a structured form is available. “Partner with us” should open a partnership inquiry flow. “Attend a session” should open an event action. “Read more” should reveal more than the same information the visitor just read.

### 6. Turn the journal into a return-visit engine

People stay when the site gives them a reason to return. The newsletter alone is not enough. The journal needs actual article detail pages with a clear reading experience, related stories, session references, mentor profiles, and a next action at the end.

A good article ending would say something like: **“Interested in Medicine? See the next Medicine session”**, **“Meet the mentor behind this story”**, or **“Get the next letter.”** That creates a loop from content to participation instead of leaving the user at the bottom of an article.

The journal’s existing editorial design is strong enough. The next step is not more animation; it is deeper content architecture.

### 7. Add a reason to return that is visibly current

The homepage currently communicates history well: sessions hosted, students reached, mentors, and community. It needs an equally clear signal of what is happening next.

Add one persistent freshness layer, such as:

> **Next up: Medicine Track Session 06 — registration opens [date].**

This can appear in the ticker, hero metadata, session section, and newsletter copy. The metrics can remain exactly as true; the improvement is adding dates and status so the site feels alive rather than archival.

### 8. Keep the visual overload, but create hierarchy inside it

The client’s requirement is not a problem. The problem would be allowing every object to have the same visual priority.

Keep the collage, stickers, ticker, animated sections, oversized type, and expressive cards. But assign them different jobs. The primary CTA should be the clearest action. The current status module should be the clearest information. Decorative objects should support the story, not compete with the conversion. The page can remain maximalist while still having one unmistakable focal point per viewport.

The rule should be:

> **Maximum expression, minimum ambiguity.**

## Questions an experienced UI/UX person should ask before the next build

| Question | What the current site answers | What still needs to be decided |
|---|---|---|
| What is the homepage’s primary job? | Introduce CA360 and create interest | Is the main conversion attendance, email signup, mentor recruitment, or all three with audience routing? |
| What can a student do today? | Read, subscribe, or click toward a session | Is there a real upcoming session action with a date and reservation path? |
| What does “Cohort 06 open” mean operationally? | It signals urgency | Where does the visitor register, and when does the cohort close? |
| Why would someone return next week? | The journal and newsletter imply future content | What is the next promised update or event? |
| What happens after every major CTA? | Several links currently route to broad anchors or generic pages | Does each destination match the exact language of the button? |
| Is the audience path obvious? | Students, mentors, and partners are all present | Should the visitor choose a path before reading the entire homepage? |
| What does “Read the recap” open? | It currently opens the journal route | Is there a real session/article detail page? |
| Which metrics are current, and what do they measure? | The metrics are true | Is there a visible date and consistent definition for each one? |
| What should the homepage make a visitor feel? | Inspired and hopeful | Should the final feeling be “I want to attend,” “I want to mentor,” or “I want to follow this organization”? |
| What is the minimum viable return loop? | Newsletter signup exists | Can a visitor read, act, and return through content without relying on email alone? |

## Priority order

| Priority | Action | Why it comes first |
|---|---|---|
| P0 | Fix CTA destinations and session recap targets | Broken promises destroy trust after the visual first impression |
| P0 | Add the next session/current cohort module | Gives visitors a concrete reason to act now |
| P1 | Add audience routing for students, mentors, and partners | Reduces cognitive load without reducing visual ambition |
| P1 | Create real session/article detail routes | Converts the site from a showcase into a useful resource |
| P1 | Add a visible freshness/update system | Gives people a reason to return |
| P2 | Add related-content and next-action loops | Extends reading and participation journeys |
| P2 | Add analytics around CTA clicks, scroll depth, newsletter starts, and completed actions | Shows whether the creative experience is actually retaining users |
| P3 | Improve photography when the client provides it | Important for authenticity, but not the immediate retention blocker |

## What should not be changed right now

The color scheme should stay. The truthful metrics should stay. The intentional visual overload should stay. The placeholder media can remain temporarily because the client already plans to replace it. The homepage does not need to be redesigned into a quiet minimalist page.

What must change is the **behavior underneath the art direction**: clear audience paths, exact CTA destinations, real current-session information, actual article/session pages, and a reason to return.

## Final brutal truth

If the current site is judged only as a visual concept, it performs well. If it is judged as a live organization’s homepage, it still has a retention problem.

Visitors will stay when the site gives them one of three things quickly: **a relevant opportunity, a useful story, or a clear way to participate**. The current homepage gives them the promise of all three, but it does not yet deliver enough of them in a concrete, operational way.

Do not make the site less creative. Make the creative experience lead somewhere real.
