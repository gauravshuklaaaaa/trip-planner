import { Compass } from 'lucide-react';

export default function EmptyState({ onLoadDemo, onStartFromScratch }) {
  return (
    <div className="empty-board-state">
      <Compass className="empty-board-icon animate-bounce" />
      <div>
        <h2>Your travel log is empty</h2>
        <p className="empty-board-text" style={{ marginTop: '0.25rem' }}>
          Write a trip description above, try one of our popular quick suggestions, or create a layout from scratch to begin plotting stops manually.
        </p>
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
        <button onClick={onLoadDemo} className="btn btn-secondary">
          🌸 Load Tokyo Demo
        </button>
        <button onClick={onStartFromScratch} className="btn btn-success">
          📝 Start From Scratch
        </button>
      </div>
    </div>
  );
}
