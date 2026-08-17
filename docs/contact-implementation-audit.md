# Contact implementation audit

## Production visual check

The new `/contact?type=partner` route renders the shared active navigation correctly and preserves the CA360 palette, typography, route marker, editorial labels, and footer language. The hero reads as a calmer conversion chapter rather than another About or homepage section.

The first viewport presents “Start the conversation,” a clear email fallback, and a four-item conversation index. The next section makes the visitor choose an audience path before the form, and the selected partner path updates the reply copy and form prompt as intended.

At desktop width, the workspace has a clear asymmetric split: audience cards on the left and one deep-teal reply/form panel on the right. The selected state is visually obvious without relying on colour alone because the card also changes contrast, position, and arrow state. The form labels remain visible above the controls, with an honest mailto fallback note.

The current implementation is intentionally mailto-backed rather than pretending to persist submissions. It prepares a contextual subject/body and exposes an explicit “Open email app” fallback after the submit action.
