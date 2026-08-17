# CA360 About and Journal UX Research Memo

**Prepared by Manus AI · 16 August 2026**

## Executive recommendation

CA360 should have a real `/about` route. “About” currently points to the homepage’s `#mission` section in both the sticky navigation and footer, while the route tree contains only `/`, `/journal`, and `/gallery`. That makes the navigation promise larger than the information architecture actually delivered. The dedicated page should not be a duplicate homepage: it should be a compact editorial explanation of why CA360 exists, how it works, who carries it, and what a visitor can do next.

The Journal should stop asking first-time visitors to infer what to do from a highly theatrical opening. The current route opens with a large “The Blog” treatment, a featured article, a “READ ARTICLES” jump, a long scroll-led transition, then filters and cards. The visual art direction is strong, but the first-time user has to understand the site’s internal choreography before receiving a clear starting instruction. The recommended replacement is an explicit “Choose your way in” moment immediately after the journal promise, followed by a clearly labelled latest/featured story area and browse-by-category controls. Motion can remain, but it should support orientation rather than gate access to content.

The two “Keep going” footer cards should be removed. The footer will retain the brand statement, newsletter continuation, sitemap, social links, and legal line without the extra “CURRENT / READ” action block.

## Current-state audit

| Area | Current state | UX consequence |
|---|---|---|
| About route | No `app/about/page.jsx` exists. StickyNav uses `href="#mission"`; Footer uses `href="/#mission"`. | A user asking “Who are these people?” is returned to a homepage section instead of receiving a dedicated explanation. |
| Footer | The “Keep going” column contains two cards: “See what’s open” and “Explore the journal.” | The footer has a second CTA system competing with the sitemap and newsletter. The user has explicitly asked for both cards to be removed. |
| Journal opening | The route leads with “The Blog,” a featured issue, a scroll cue, and a later filter/grid. | The page is visually distinctive but does not answer the novice question “What should I do here?” early enough. |
| Journal discovery | Category filters and article cards are present, and article cards expose a readable excerpt and metadata. | The raw ingredients are good, but the opening hierarchy does not teach users how the archive is useful to them. |
| Article reading | The current implementation uses an in-page reading-room dialog and hash-based article identifiers. | This is a strong short-term interaction, but durable article routes and full article content remain client-owned/content-system work. |

## Research findings

### 1. Give every click a clear promise

Nielsen Norman Group defines **information scent** as the cues people use to estimate whether a link will contain what they need and how much effort it will take to get there. The link label, surrounding context, and summary all contribute to that estimate. Their guidance is especially relevant to CA360 because “Journal,” “Blog,” and “Read articles” describe a destination only at a broad level; a first-time student may still not know which story is meant for their problem. The page needs visible labels that describe outcomes, not just content types. [1]

NN/g also warns that landing pages often provide too little context in the first screenful. A large image or expressive headline without an immediate explanation can cause users to stop scrolling before they discover the useful content below. CA360’s current scroll-led journal intro is precisely the kind of moment where art direction needs to be paired with a direct first action. [1]

### 2. Separate known intent from open-ended discovery

Baymard distinguishes **findability**—locating something the visitor already knows exists—from **discoverability**—encountering useful content the visitor did not know existed. A good journal page needs both. Category choices and plain-language pathways help a visitor with a known need; featured and related stories create discovery for visitors who are browsing. Baymard also emphasizes information architecture, meaningful categories, related content, and consistency across the site. [2]

For CA360, this means the first journal interaction should not be a filter bar alone. A student may not think “I need a career guide”; they may think “I’m scared I’m choosing the wrong course.” The interface should translate that concern into a content pathway while still preserving category browsing for returning visitors.

### 3. Design for several reader motives, not one ideal journey

The Guardian’s redesign research identified three recurring homepage motives: **update**, **extend**, and **discover**. Update means seeing what is new; extend means gaining deeper understanding of a specific subject; discover means finding new perspectives or unexpected material. The Guardian also described “every article should be a homepage” and used modular containers, related links, and varied story emphasis so people could enter through many paths and continue exploring. [3] [4]

The useful lesson for CA360 is not to imitate a newspaper. It is to make the Journal support three equally legitimate behaviors: “show me what is new,” “help me understand a career decision,” and “let me wander through honest stories.” The current page privileges the theatrical scroll before clearly naming those behaviors.

### 4. Every mission-led page must orient, signpost, and bridge

Research and commentary on charity information architecture repeatedly identify the same problem: mission-led organisations serve overlapping audiences—beneficiaries, volunteers, partners, donors, and advocates—and can easily produce digital clutter. Econsultancy’s discussion of charity websites recommends treating **every page as a homepage**: visitors may arrive from search or social, so each page needs orientation, signposting, relevant onward content, and a clear next step. It also stresses that the bridges between different user journeys matter. [5]

That principle supports two CA360 decisions. First, About should explain the organisation to a newcomer without forcing them to reconstruct the story from homepage sections. Second, every Journal reading state should offer a sensible next move—another relevant story, the monthly letter, or a practical CA360 action—without abruptly throwing the user back to the homepage.

### 5. Editorial aesthetics should create calm, not remove instruction

Tubik’s editorial design review repeatedly connects readable type, generous margins, deliberate pacing, and structured modular layouts with longer reading and easier scanning. The interface should act as a quiet editor: establish hierarchy, make content legible, and let visual mood frame the story rather than compete with it. The review also notes that strong editorial platforms support both skimmers and deep readers. [6]

This is the right contrast for CA360. The homepage can remain intentionally maximalist. The Journal should be the calmer “reader’s room” of the brand: still recognisably CA360 through Sora, Fraunces, orange, teal, and editorial numbering, but more explicit, more navigable, and less dependent on scroll performance to reveal its purpose.

### 6. Creative nonprofit experiences still need immediate action clarity

Awwwards’ nonprofit collection demonstrates that mission-led sites can be highly expressive, immersive, and experimental, but the strongest examples still make the cause, content, and action visible. CauseVox’s nonprofit guidance similarly prioritises clear navigation, clear calls to action, personal impact stories, search or discovery support, accessibility, and content maintenance. [7] [8]

The implication is important for the client’s “Awwwards-worthy” ambition: creativity is not the opposite of clarity. The site earns trust when the unusual layout is paired with conventional, instantly recognisable labels and a confident next step.

## Recommended Journal flow

### First screen: establish purpose and give the user a choice

Replace the current opening sequence’s implicit instruction—“watch the typography, then scroll”—with an explicit editorial welcome. Keep the distinctive large type, but change the subhead to a direct promise such as: **“Stories, guides, and honest takes for the path after SHS.”** Under it, introduce a compact **Choose your way in** rail with three outcome-led choices:

| Visitor thought | Visible entry point | Content destination |
|---|---|---|
| “I am choosing a course or career.” | **I need career clarity** | Career guides and admissions stories |
| “I want to know what the work is really like.” | **Show me the real path** | Mentor stories and session recaps |
| “I do not know where to start.” | **Start with the latest** | The newest featured story plus recent articles |

These labels have stronger information scent than “Read articles” because they mirror the visitor’s mental model. They also answer the user’s exact concern: a person who arrives without a plan receives a plan immediately.

### Second movement: make the featured story feel like a recommendation

Retain the featured issue, but add a visible framing line such as **“If you only read one today”** or **“A good place to begin.”** Keep the article title, excerpt, date, and reading time together. The primary action should say **“Read the featured story”** rather than “Read this issue,” because the latter sounds like a periodical object that may not be obvious to a student.

### Third movement: let users browse by need and by category

Place the category controls directly above the archive, but give the group an explanatory heading: **“Browse by what you need.”** Keep the current categories, but consider adding a first-class “Start here” state that combines the strongest introductory pieces. The first state should not feel like a technical filter; it should feel like a guided shelf.

### Fourth movement: preserve the current card strength, improve the labels

The current cards already have useful excerpts, dates, reading times, and category labels. The primary improvement is to make the action more specific and to ensure the article card’s headline and summary jointly answer “why should I spend five minutes here?” This follows NN/g’s information-scent guidance. [1]

### Fifth movement: every reading state should lead somewhere

Keep the reading-room modal for now because it is coherent with the editorial art direction and already has keyboard focus handling. Add a clear reading context at the top, a “next story” or “keep exploring” recommendation after the excerpt, and one practical CA360 continuation. The best continuation is contextual: a career-guide article can lead to the current opportunity; a mentor story can lead to the mentor pathway; a student story can lead to the newsletter or next session.

### Aesthetic direction

The Journal should become **the calm counterweight to the maximalist homepage**. Preserve the locked palette and type system, but reduce the amount of unlabelled theatrical space at the very beginning. Use a stronger editorial grid, one high-contrast starting rail, shorter scroll distance before the first decision, and more visible grouping between “start,” “browse,” and “read.” The result should feel like entering a well-curated reading room rather than discovering a visual installation whose controls appear later.

## Recommended About page architecture

The About page should have a clear narrative rather than a copy of the homepage sections.

| Chapter | Purpose | Existing material to adapt |
|---|---|---|
| **Why this exists** | State the problem in plain language: students make high-stakes choices without enough lived context. | Mission section and origin copy |
| **The beginning** | Tell Dr. A. Asare’s story and explain the personal reason CA360 was built. | Origin section and founder quote |
| **How CA360 works** | Explain the operating model: honest conversations, lived experience, community, and free access. | Mission facts, Programs, Sessions |
| **Who carries it** | Introduce mentors as people with lived paths rather than decorative portraits. | Mentors roster and mentor copy |
| **What has happened so far** | Show the current evidence and keep the numbers contextual. | Impact and current cohort content |
| **Choose your role** | Give students, mentors, schools, and partners one direct next step each. | CurrentOpportunity and JoinIn destinations |

The route should use a dedicated `03 ABOUT` or `02 ABOUT` marker consistent with the existing Journal and Gallery orientation system. It should feel more intimate and explanatory than the homepage, with the existing placeholders retained until client-owned photography is available.

## Implementation decision

The research supports the following implementation order: create `/about`; change every About navigation and footer reference to `/about`; remove the two “Keep going” footer cards and their layout styling if unused; replace the Journal’s uncertain opening with an explicit choice rail and clearer featured-story framing; preserve the existing category archive, reading-room interaction, locked palette, and placeholder system; then run a production build and rendered DOM audit.

This is the best balance between the client’s desire for a distinctive, Awwwards-aware experience and the user’s need for immediate orientation. A true 10/10 Journal still depends on client-owned article content, durable article routes, and real photography, but the flow itself can be made substantially clearer now.

## References

[1]: https://www.nngroup.com/articles/information-scent/ "Nielsen Norman Group — Information Scent: How Users Decide Where to Go Next"

[2]: https://baymard.com/learn/findability-vs-discoverability-ux "Baymard Institute — Findability and Discoverability: 6 UX Tips"

[3]: https://www.theguardian.com/help/insideguardian/2015/jan/28/welcome-to-the-new-guardian-website "The Guardian — Welcome to the new Guardian website"

[4]: https://www.journalism.co.uk/key-principles-behind-the-new-guardian-website/ "Journalism.co.uk — Key principles behind the new Guardian website"

[5]: https://econsultancy.com/charity-websites-must-tackle-content-design-information-architecture/ "Econsultancy — Charity websites must tackle content design and information architecture"

[6]: https://tubikstudio.com/blog/media-editorial-website-design/ "Tubik — Information, Beautified: 13 Editorial Web Designs"

[7]: https://www.awwwards.com/awwwards/collections/nonprofit-websites/ "Awwwards — Nonprofit Websites collection"

[8]: https://www.causevox.com/blog/nonprofit-websites/ "CauseVox — Nonprofit Website Best Practices: 20 Inspiring Examples"
