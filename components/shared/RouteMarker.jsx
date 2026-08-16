export function RouteMarker({ index, label, context, dark = false }) {
  return (
    <div className={`route-marker${dark ? ' route-marker-dark' : ''}`} aria-label={`${label} route`}>
      <span className="route-marker-index">{index}</span>
      <span className="route-marker-label">{label}</span>
      <span className="route-marker-rule" aria-hidden="true" />
      {context && <span className="route-marker-context">{context}</span>}
    </div>
  );
}
