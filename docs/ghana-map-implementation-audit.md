# Ghana map implementation audit

## Production verification

The Contact route now renders a real Ghana regional SVG using the simplified TopoJSON asset and react-simple-maps. The route exposes three meaningful markers aligned with the established CA360 vocabulary: Korle Bu in Accra, KNUST in Kumasi, and UCC in Cape Coast.

The production DOM exposes the three map marker groups as keyboard-reachable SVG buttons and a separate location tablist with one active tab, `aria-controls="ct-presence-panel"`, and a live detail panel. The map carries an accessible image label and title, while the location tabs retain visible names and direct detail content.

The map chapter is visually distinct from the form workspace: deep teal grid field, cream regional boundaries, orange active marker, coordinate ticks, and editorial labels. It appears after the contact task and before the response-expectations chapter, making geography a contextual trust layer rather than an obstacle to contacting CA360.
