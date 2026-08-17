# Letters-to-Newsletter Combined Transition Audit

## Start state

The combined section renders as one sticky teal scene with the cream “Letters.” title, the dotted flight path, and the subline “Don’t miss a single one.” The component now mounts one `.jdrift` section instead of separate Drift and Newsletter sections. The rendered shared section measures approximately 1,870px at a 1,100px viewport, equivalent to roughly 170vh desktop.

The starting state is visually clean and preserves the previous Letters identity. The newsletter layer is present in the same scene but begins transparent and non-interactive until the airplane has completed enough of the path.

## First morph state

At approximately 68% through the shared section, the orange newsletter layer appears in the same viewport as the fading cream “Letters.” title and path. The architecture successfully removes the separate newsletter chapter, but the first crossfade is too visually congested: the oversized title remains visible behind “ONE LETTER” and the side note. The next refinement should make the Letters title exit earlier and bring the newsletter content in after the plane completes, rather than treating both as equally visible for too long.

## Refined morph state

After tightening the timing, the production render at approximately 70% through the shared chapter shows a clean orange newsletter scene: the newsletter title, supporting copy, form, and right-side field note are readable together, while the previous oversized “Letters.” title has exited. The plane/path is no longer competing with the form at this point. The transition now reads as a two-beat sequence: travel first, invitation second.

## Deep-link verification

Opening `/journal#journal-letter` now lands directly on the orange newsletter scene. The newsletter layer reports `opacity: 1`, `pointer-events: auto`, `aria-hidden="false"`, and both form controls remain keyboard reachable. The combined section retains its accessible `aria-labelledby="jdrift-title"` and `aria-describedby="jdrift-copy"` relationships. The rendered audit found zero invalid anchors, zero Journal tab relationship issues, and the explicit email label is present.
