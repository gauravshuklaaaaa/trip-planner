import { Plus, Trash2, Compass, Moon, Sun, X, Map } from 'lucide-react';

export default function HistorySidebar({
  history,
  currentTripId,
  onSelectTrip,
  onDeleteTrip,
  onNewTrip,
  theme,
  toggleTheme,
  isOpen,
  onClose
}) {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'visible' : ''}`} 
        onClick={onClose}
      />
      
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <Compass className="brand-icon text-accent" />
            <span>TRIP PLANNER</span>
          </div>
          <button className="sidebar-close-btn no-print" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* New Trip Action */}
        <div className="sidebar-actions no-print">
          <button className="new-trip-btn" onClick={() => { onNewTrip(); onClose(); }}>
            <Plus size={18} />
            <span>New Trip</span>
          </button>
        </div>

        {/* History Scroll Area */}
        <div className="sidebar-history-container">
          <div className="history-label">Recent Trips</div>
          {history.length === 0 ? (
            <div className="history-empty">No recent trips yet. Plan one to see it here!</div>
          ) : (
            <div className="history-list">
              {history.map((trip) => {
                const isActive = trip.id === currentTripId;
                // Generate a clean display title based on prompt or destination
                const displayTitle = trip.itinerary && trip.itinerary[0]?.title
                  ? trip.itinerary[0].title.replace(/^Day \d+:\s*/i, '')
                  : trip.prompt.slice(0, 24) + (trip.prompt.length > 24 ? '...' : '');

                return (
                  <div
                    key={trip.id}
                    className={`history-item ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      onSelectTrip(trip);
                      onClose();
                    }}
                  >
                    <Map size={16} className="history-icon" />
                    <span className="history-title" title={trip.prompt}>
                      {displayTitle}
                    </span>
                    <button
                      className="history-delete-btn"
                      onClick={(e) => onDeleteTrip(e, trip.id)}
                      title="Delete trip from history"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar Footer settings */}
        <div className="sidebar-footer no-print">
          <button onClick={toggleTheme} className="sidebar-footer-btn">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            <span>{theme === 'light' ? 'Night flight' : 'Sunny sky'}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
