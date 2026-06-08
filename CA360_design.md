 # NGO Website Design System

 This document is the full design-system and page-structure reference for a mentorship and career-guidance NGO serving Senior High School graduates. It is formatted as a single Markdown file you can paste into Figma or use as a handoff.

 ---

 ## Direction

 Build a youthful, professional NGO website. The site should feel warm, credible, and energetic, with teal and orange as the core brand colors, white as breathing space, and a mix of photography and illustration.

 References:
 - [Ahadi Foundation](https://ahadi-foundation.org/en/) — homepage rhythm and emotional warmth.
 - [Big Brothers Big Sisters](https://www.bbbs.org/) — mentorship storytelling and impact proof.
 - [MENTOR](https://www.mentoring.org/) — mission framing, action tiers.
 - [AIESEC](https://www.aiesec.org/) — membership/join architecture.
 - [Royal Stranger - Crafted Edits](https://royalstranger.com/sofia-santos-crafted-edits/) — blog/editorial look.
 - [Awwwards footer collection](https://www.awwwards.com/awwwards/collections/website-footer-design-best-practices/) — footer inspiration.

 ---

 ## Brand Tokens

 | Token | Hex | Usage |
 |---|---:|---|
 | Primary orange | `#d68307` | Primary CTA, highlights, badges, key numbers |
 | Primary teal | `#36728f` | Main brand color, headers, nav accents, section grounding |
 | White | `#ffffff` | Background, breathing room, clean contrast |
 | Light teal tint | `#e7f1f4` | Soft panels, section backgrounds, placeholders |
 | Light orange tint | `#f9e7c8` | Hover states, subtle emphasis, tags |
 | Dark text | `#16323c` | Main body copy |
 | Muted text | `#6b7c84` | Secondary text, labels, helper copy |

 ### Color Usage Rules

 | Element | Color rule |
 |---|---|
 | Main CTA | Orange |
 | Secondary CTA | Teal |
 | Headings | Teal or dark text |
 | Section backgrounds | White or light teal tint |
 | Badges and labels | Orange for active, muted gray for inactive |
 | Coming soon states | Muted teal-gray or light teal tint |
 | Footer | Teal or dark teal background with white text |

 ---

 ## Typography

 | Role | Recommendation | Notes |
 |---|---|---|
 | Headings | Sora, Poppins, or Nunito | Friendly, modern, credible |
 | Body | Inter, Work Sans, or Source Sans 3 | Highly readable for long content |
 | Emphasis | Italics used sparingly | For quotes, pull lines, founder story |

 ### Type Scale Suggestion

 | Text role | Size | Weight | Use |
 |---|---:|---:|---|
 | H1 | 48 to 56px | 700 | Hero headline |
 | H2 | 32 to 40px | 700 | Section headings |
 | H3 | 24 to 28px | 600 | Card titles, subsection titles |
 | Body | 16 to 18px | 400 to 500 | General reading text |
 | Small | 14px | 400 to 500 | Labels, notes, helper text |
 | Micro | 12px | 400 | Meta, badges, timestamps |

 ---

 ## Layout System

 | Token | Recommendation |
 |---|---|
 | Base spacing | 8px scale |
 | Common spacing steps | 8, 16, 24, 32, 48, 64, 96 |
 | Max width | 1200 to 1280px |
 | Radius | 12 to 16px |
 | Desktop section spacing | 96px |
 | Mobile section spacing | 64px |
 | Card shadow | Soft, minimal |
 | Button shape | Rounded and modern |
 | Icon style | Simple line icons with consistent stroke |

 ### Motion Rules

 | Motion | Recommendation |
 |---|---|
 | Page load | Gentle fade and rise |
 | Cards | Soft hover lift |
 | Buttons | Slight color shift and shadow on hover |
 | Gallery | Light zoom on hover |
 | Hero | Subtle staggered entrance |

 ---

 ## Main Site Pages

 | Page | Purpose | Core sections |
 |---|---|---|
 | Home | Introduce mission and drive action | Hero, mission, origin story, fields covered, programs, value blocks, mentors preview, impact stats, recent sessions, get involved, newsletter, footer |
 | About | Build trust and explain the story | Mission, founder story, values, team, impact, partners, contact CTA |
 | Mentors | Show the people guiding students | Mentor cards, filters, bio snippets, field tags, join CTA |
 | Membership / Join | Capture volunteers, mentors, and community members | Role cards, join options, FAQ, application CTA |
 | Blog / News | Publish recaps, ideas, and updates | Featured story, article grid, categories, newsletter CTA |
 | Gallery / Stories | Show proof visually | Image grid, event albums, quote overlays, story cards |
 | Contact | Make outreach easy | Contact form, direct info, socials, partnership inquiry |

 ---

 ## Homepage Structure

 | Section | Goal | Suggested content |
 |---|---|---|
 | Hero | Explain the mission immediately | Headline, short subhead, primary CTA, secondary CTA, visual |
 | Mission | State the purpose clearly | One strong paragraph describing guidance, mentorship, opportunity |
 | Origin story | Build trust through the founder | Short founder narrative with portrait and pull quote |
 | Fields covered | Show current and future tracks | Medicine, Law, Engineering, Business |
 | Programs | Present the NGO’s services | Virtual sessions, mentorship matching, school visits, resource hub |
 | What you gain | Translate services into benefits | Academic guidance, career clarity, personal growth |
 | Mentors preview | Humanize the organization | Mentor portraits, field labels, quotes |
 | Impact | Prove the work is real | 5 sessions hosted, 300+ participants, feedback/testimonials |
 | Recent sessions | Turn activity into content | Post-style cards with images and titles |
 | Get involved | Push participation | Attend, Mentor, Support/Partner |
 | Newsletter | Keep the audience warm | Simple email signup and value line |
 | Footer | Finish with utility and trust | Sitemap, contact, socials, legal |

 ---

 ## Exact Homepage Copy Direction

 | Section | Copy direction |
 |---|---|
 | Hero headline | From Senior High to the career you were meant for |
 | Hero subhead | Real guidance. Real mentors. Real clarity. |
 | Mission line | We bridge the gap between aspiring professionals and the knowledge they need to succeed. |
 | Origin story | A short personal story about not knowing where to begin after SHS and wanting to create the support that was missing. |
 | Fields covered | Medicine is live now. Law, Engineering, and Business can appear as future tracks. |
 | Programs | Virtual sessions, mentorship matching, school visits, resource hub. |
 | Value promise | Academic guidance, career clarity, personal growth. |
 | Impact line | 5 sessions hosted. 300+ participants reached. Life-changing feedback. |
 | Join CTA trio | Attend a session. Become a mentor. Support the mission. |

 ---

 ## Component Library

 | Component | Purpose | Style direction | Reference websites |
 |---|---|---|---|
 | Hero banner | First impression and main CTA | Large headline, clear hierarchy, strong whitespace | [Ahadi Foundation](https://ahadi-foundation.org/en/), [AIESEC](https://www.aiesec.org/) |
 | Mission block | Explain the purpose | Split layout with text and supporting visual | [Ahadi Foundation](https://ahadi-foundation.org/en/), [MENTOR](https://www.mentoring.org/) |
 | Founder story card | Build emotional trust | Portrait, short bio, quote, link to more | [Ahadi Foundation](https://ahadi-foundation.org/en/) |
 | Field cards | Show current and future focus | 4-card grid with active and muted states | [Ahadi Foundation](https://ahadi-foundation.org/en/), [AIESEC](https://www.aiesec.org/) |
 | Program carousel | Present services cleanly | Horizontal cards with numbering | [Ahadi Foundation](https://ahadi-foundation.org/en/) |
 | Value cards | Turn work into benefits | 3-icon cards | [MENTOR](https://www.mentoring.org/) |
 | Mentor profile card | Introduce people behind the NGO | Circular portrait, name, field, short quote | [BBBS](https://www.bbbs.org/), [MENTOR](https://www.mentoring.org/) |
 | Impact stat band | Build credibility fast | Large numeric emphasis, short labels | [BBBS](https://www.bbbs.org/), [AIESEC](https://www.aiesec.org/) |
 | Session recap card | Blog/news/story item | Image, title, excerpt, date | [Royal Stranger](https://royalstranger.com/sofia-santos-crafted-edits/), [BBBS](https://www.bbbs.org/) |
 | Gallery tile | Visual storytelling | Large image, optional overlay text | [BBBS](https://www.bbbs.org/), [Ahadi Foundation](https://ahadi-foundation.org/en/) |
 | CTA trio block | Drive participation | Three action cards in a row or stack | [BBBS](https://www.bbbs.org/), [MENTOR](https://www.mentoring.org/) |
 | Newsletter signup | Keep users engaged | Simple email capture with concise value line | [Ahadi Foundation](https://ahadi-foundation.org/en/) |
 | Footer mega block | Utility and brand finish | Dense, designed, readable footer | [Awwwards footer collection](https://www.awwwards.com/awwwards/collections/website-footer-design-best-practices/), [AIESEC](https://www.aiesec.org/) |

 ---

 ## Page-by-Page Section Checklist

 ### Home
 Hero, mission, origin story, fields covered, programs, value cards, mentors preview, impact, recent sessions, CTA trio, newsletter, footer.

 ### About
 Mission, founder story, timeline, values, team, impact stats, partner logos, contact CTA.

 ### Mentors
 Intro, mentor filters, mentor cards, mentor detail view, application CTA, trust block.

 ### Membership / Join
 Join intro, role cards, FAQ, application paths, CTA band.

 ### Blog / News
 Featured story, article grid, category filters, session recap cards, newsletter CTA.

 ### Gallery / Stories
 Image grid, story cards, testimonial overlays, event albums, contact CTA.

 ### Contact
 Contact form, direct contact info, social links, partnership inquiry, footer.

 ---

 ## Footer Direction

 | Zone | What to include | Style note |
 |---|---|---|
 | Brand panel | Logo, short mission line, CTA | Feels like a designed closing section |
 | Sitemap | Home, About, Mentors, Membership, Blog, Gallery, Contact | Easy to scan |
 | Contact | Email, location, inquiry path | Direct and welcoming |
 | Social links | Instagram, LinkedIn, YouTube, X if used | Youthful but professional |
 | Legal | Privacy, terms, cookies, data policy | Trust and compliance |

 ---

 ## About Page Structure

 | Section | Goal | Reference websites |
 |---|---|---|
 | Mission | Explain why the NGO exists | [Ahadi Foundation](https://ahadi-foundation.org/en/), [MENTOR](https://www.mentoring.org/) |
 | Founder story | Humanize the organization | [Ahadi Foundation](https://ahadi-foundation.org/en/) |
 | Values | Show what the organization stands for | [AIESEC](https://www.aiesec.org/) |
 | Team | Show leadership and people | [Ahadi Foundation](https://ahadi-foundation.org/en/) |
 | Impact | Prove growth and credibility | [BBBS](https://www.bbbs.org/), [AIESEC](https://www.aiesec.org/) |
 | Partners | Show alliances and support | [AIESEC](https://www.aiesec.org/), [Ahadi Foundation](https://ahadi-foundation.org/en/) |

 ---

 ## Mentors Page Structure

 | Section | Goal | Reference websites |
 |---|---|---|
 | Intro | Explain why mentors matter | [MENTOR](https://www.mentoring.org/) |
 | Filter row | Sort by field, availability, role, location | [AIESEC](https://www.aiesec.org/) |
 | Mentor cards | Show each mentor clearly | [BBBS](https://www.bbbs.org/), [MENTOR](https://www.mentoring.org/) |
 | Mentor detail | Bio, expertise, short quote, involvement | [BBBS](https://www.bbbs.org/) |
 | Join CTA | Recruit more mentors | [AIESEC](https://www.aiesec.org/), [MENTOR](https://www.mentoring.org/) |

 ### Mentor Card Fields

 | Field | Content |
 |---|---|
 | Photo | Circular or rounded portrait |
 | Name | Full name |
 | Field | Medicine, Law, Engineering, Business |
 | Short bio | One to two lines |
 | Quote | A short mentor statement |
 | Tag | Active mentor, guest mentor, or volunteer |

 ---

 ## Membership / Join Page Structure

 | Section | Goal | Reference websites |
 |---|---|---|
 | Join intro | Explain who can join | [AIESEC](https://www.aiesec.org/) |
 | Role cards | Separate students, mentors, volunteers, partners | [AIESEC](https://www.aiesec.org/), [BBBS](https://www.bbbs.org/) |
 | FAQ | Remove friction | [MENTOR](https://www.mentoring.org/) |
 | Application CTA | Convert interest to action | [AIESEC](https://www.aiesec.org/) |

 ### Membership Roles

 | Role | Purpose |
 |---|---|
 | Student member | Attends sessions and learns from mentors |
 | Mentor member | Supports and guides students |
 | Volunteer | Helps with events, outreach, or operations |
 | Partner | Supports through schools, institutions, or sponsorship |

 ---

 ## Blog / News Page Structure

 | Section | Goal | Reference websites |
 |---|---|---|
 | Featured story | Highlight the most important post | [Royal Stranger](https://royalstranger.com/sofia-santos-crafted-edits/) |
 | Article grid | Show multiple stories or recaps | [BBBS](https://www.bbbs.org/) |
 | Category filters | Sort by medicine, law, engineering, business, general | [Royal Stranger](https://royalstranger.com/sofia-santos-crafted-edits/) |
 | Newsletter CTA | Keep readers connected | [Ahadi Foundation](https://ahadi-foundation.org/en/) |

 ### Blog Content Types

 | Content type | Purpose |
 |---|---|
 | Session recap | Recount a mentorship event |
 | Student story | Show impact on a learner |
 | Mentor story | Introduce a mentor’s background |
 | Career guide | Practical advice for students |
 | Field spotlight | Medicine, law, engineering, business |
 | News update | Organization announcements |

 ---

 ## Gallery / Stories Page Structure

 | Section | Goal | Reference websites |
 |---|---|---|
 | Photo grid | Show real activity and community | [BBBS](https://www.bbbs.org/) |
 | Story cards | Add context to images | [Ahadi Foundation](https://ahadi-foundation.org/en/) |
 | Quote overlays | Make images feel human | [BBBS](https://www.bbbs.org/) |
 | Event albums | Group related moments | [Ahadi Foundation](https://ahadi-foundation.org/en/) |

 ---

 ## Contact Page Structure

 | Section | Goal | Reference websites |
 |---|---|---|
 | Contact form | Allow inquiries | [Ahadi Foundation](https://ahadi-foundation.org/en/) |
 | Direct info | Email, phone, location | [MENTOR](https://www.mentoring.org/) |
 | Partnership inquiry | Let schools and partners reach out | [AIESEC](https://www.aiesec.org/) |
 | Social links | Extend the conversation | [BBBS](https://www.bbbs.org/) |

 ---

 ## Content Rules

 | Rule | Recommendation |
 |---|---|
 | Current focus | Medicine should be the lead field now |
 | Expansion | Law, engineering, and business should appear as future tracks |
 | Proof | Use the 5 sessions and 300+ participants prominently |
 | Voice | Practical, encouraging, informed, human |
 | Imagery | Use real photos when possible |
 | Illustration | Use for abstract ideas or future tracks |
 | CTA hierarchy | Orange for main action, teal for secondary action |
 | Podcast | Leave it out for now if it is not confirmed |

 ---

 ## Visual Style Rules

 | Area | Recommendation |
 |---|---|
 | Overall look | Youthful, polished, and sincere |
 | Spacing | Generous whitespace, not crowded |
 | Backgrounds | Mostly white with light teal sections |
 | Cards | Rounded, soft shadow, clear hierarchy |
 | Photography | Real people and real sessions should dominate |
 | Illustration | Use selectively for support and future-facing sections |
 | Buttons | Bold orange primary, teal secondary |
 | Icons | Clean line icons only |

 ---

 ## Mobile Rules

 | Area | Mobile direction |
 |---|---|
 | Hero | Stack text above visual, keep CTA pair visible |
 | Cards | Switch to one-column or safe two-column layout |
 | Stats | Stack vertically with clear spacing |
 | Footer | Use stacked or accordion structure |
 | Navigation | Keep it minimal and easy to scan |

 ---

 ## Build Order For Figma

 | Priority | What to build first | Why |
 |---|---|---|
 | 1 | Color tokens, type scale, spacing scale | Establishes the design language |
 | 2 | Core components | Makes the rest of the system consistent |
 | 3 | Homepage wireframe | Main brand statement and source of truth |
 | 4 | About and Mentors pages | Trust and human presence |
 | 5 | Membership and Blog pages | Participation and content system |
 | 6 | Gallery and Contact pages | Visual proof and outreach |
 | 7 | Footer system | Final polish and utility |

 ---

 ## Final Recommendation

 Recommended references per need:
 - Homepage: [Ahadi Foundation](https://ahadi-foundation.org/en/)
 - Mentorship storytelling: [Big Brothers Big Sisters](https://www.bbbs.org/)
 - Mission + impact: [MENTOR](https://www.mentoring.org/)
 - Membership: [AIESEC](https://www.aiesec.org/)
 - Blog/editorial: [Royal Stranger](https://royalstranger.com/sofia-santos-crafted-edits/)
 - Footer ideas: [Awwwards footer collection](https://www.awwwards.com/awwwards/collections/website-footer-design-best-practices/)

 ---

 ## Next steps you can ask me to do (examples)
 - Produce Figma-ready tokens (exact px values, font weights, letter spacing, component variants)
 - Generate example HTML/CSS for the homepage hero and stat band
 - Draft full copy for the About page and Mentor bios
 - Create a simple CMS-friendly content model for pages and mentors


*File copied to `/home/sefikura_skies/CA360_design.md`.*

 ---

 ## Figma-ready tokens (exact values)

 These tokens are ready to copy into Figma or into a tokens plugin. Use the JSON companion file `CA360_tokens.json` in this folder for plugin import.

 ### Colors

 - Primary / Orange: `#d68307`
 - Primary / Teal: `#36728f`
 - White: `#ffffff`
 - Light teal tint: `#e7f1f4`
 - Light orange tint: `#f9e7c8`
 - Dark text: `#16323c`
 - Muted text: `#6b7c84`

 ### Typography tokens

 - Font families:
	 - Headings: Sora, fallback system sans
	 - Body: Inter, fallback system sans

 - Heading styles:
	 - H1: 56px / 700 / line-height 64px / letter-spacing 0px
	 - H2: 40px / 700 / line-height 48px / letter-spacing 0px
	 - H3: 28px / 600 / line-height 36px / letter-spacing 0px

 - Body styles:
	 - Body: 16px / 400 / line-height 24px / letter-spacing 0px
	 - Small: 14px / 400 / line-height 20px / letter-spacing 0px
	 - Micro: 12px / 400 / line-height 16px / letter-spacing 0px

 ### Spacing scale (8px base)

 - `space-1`: 8px
 - `space-2`: 16px
 - `space-3`: 24px
 - `space-4`: 32px
 - `space-6`: 48px
 - `space-8`: 64px
 - `space-12`: 96px

 ### Radii

 - `radius-sm`: 8px
 - `radius-md`: 12px
 - `radius-lg`: 16px
 - `radius-pill`: 999px

 ### Shadows / elevation

 - `shadow-1`: 0 4px 12px rgba(22,50,60,0.06)
 - `shadow-2`: 0 8px 24px rgba(22,50,60,0.08)

 ### Buttons (component tokens)

 - Primary button
	 - Background: `#d68307`
	 - Text color: `#ffffff`
	 - Padding: 14px 24px
	 - Radius: `radius-md` (12px)

 - Secondary button
	 - Background: `#36728f`
	 - Text color: `#ffffff`
	 - Padding: 12px 20px
	 - Radius: `radius-md` (12px)

 ### Breakpoints

 - `bp-xs`: 360px
 - `bp-sm`: 480px
 - `bp-md`: 768px
 - `bp-lg`: 1024px
 - `bp-xl`: 1280px

 ---

 ## How to use

 - Import the `CA360_tokens.json` file into your Figma tokens plugin or manually copy the values above into Figma styles.
 - Create text styles for H1/H2/H3/Body/Small and color styles for each listed token.
 - Create components from the button specs and apply tokens for padding, radii, colors, and shadows.

 ---


