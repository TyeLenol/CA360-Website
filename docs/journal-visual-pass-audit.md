# Journal Visual Pass Audit

## Initial production render

The revised route now has a shorter total page and clearer labels. The first screen still retains the distinctive monumental “The Journal” title, but the CTA and statement sit closer to the bottom action zone. The route now reads “ON THE SHELF” rather than “PUBLISHED,” which is a better fit for a placeholder-content shell.

## Start rail

The “Choose your way in” rail remains visually strong. Its three cards now use a truthful mentor-focused description for “Show me the path,” and the featured chapter begins immediately below the rail rather than after another long spacer.

## Featured chapter

The featured story now reads as one complete decision unit in a single viewport: image, category, date, reading time, headline, excerpt, venue, author, and “Open story preview” CTA are visible together. This is a substantial improvement over the earlier late-reveal version.

## Shell changes

The archive transition is now a compact editorial signpost rather than a 160vh fixed scroll gate. The archive has a visible shelf heading, direct filtered-state copy, an explained count, and a “One story should lead to another” continuation chapter. Article actions now say “Open preview,” matching the current placeholder article depth.

## Preview verification

The story modal now identifies itself as `STORY PREVIEW`, and the featured/archive actions use “Open story preview” and “OPEN PREVIEW.” The live dialog retains `aria-modal="true"`, a valid title relationship, a scrollable panel, and three focusable controls (close, homepage opportunity, and newsletter). The keyboard focus loop is now explicitly implemented within the panel.

## Filtered archive verification

Career Guides now renders an explicit `FILTERED SHELF` label, the heading `The archive, in full.`, the copy `Showing 3 career guides.`, and a visible count of `3 career guides`. The continuation card also switches to a Career Guide story, so the downstream journey matches the active filter instead of reverting to an unrelated mentor essay.

## Start-path verification

The `Show me the path` start card now leads to the Mentor Stories shelf. The live filtered state reports `Showing 2 mentor stories`, displays `2 mentor stories`, and the continuation story remains in the same mentor category. The pathway copy and destination now agree.

## Final verification

`npm run build` and `git diff --check` pass. The static export still generates `/`, `/about`, `/gallery`, and `/journal`. The rendered Journal audit reports zero invalid anchors, zero unlabeled fields, no tab relationship issues, `aria-labelledby="journal-grid-title"` on the archive panel, and the continuation chapter present.
