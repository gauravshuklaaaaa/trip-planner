export default function LoadingBox({ currentTip }) {
  return (
    <div className="loading-box">
      <div className="spinner"></div>
      <div>
        <h3>Drafting your custom itinerary...</h3>
        <p style={{ color: 'var(--color-secondary)', marginTop: '0.25rem' }}>Organizing stops and routes...</p>
      </div>
      <div className="sticky-note">
        <p className="loading-tips">
          💡 {currentTip}
        </p>
      </div>
    </div>
  );
}
