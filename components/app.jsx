/* ============================================================
   APP — Root composition
   ============================================================ */

function App() {
  // Global IntersectionObserver for [data-reveal] nodes
  useGlobalRevealObserver();

  return (
    <div className="app-root">
      <StickyNav />
      <main>
        <Hero />
        <Mission />
        <Origin />
        <Fields />
        <Programs />
        <Gain />
        <Mentors />
        <Impact />
        <Sessions />
        <JoinIn />
        <Newsletter />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
