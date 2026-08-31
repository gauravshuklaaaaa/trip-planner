import { Calendar, Trash2, Plus } from 'lucide-react';

export default function DaysSidebar({ 
  itinerary, 
  activeDayIndex, 
  setActiveDayIndex, 
  onAddDay, 
  onRemoveDay 
}) {
  return (
    <aside className="days-sidebar">
      <h3 className="sidebar-title">
        <span>Days</span>
        <Calendar size={18} style={{ color: 'var(--color-secondary)' }} />
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {itinerary.map((day, idx) => (
          <div 
            key={day.id} 
            className={`day-tab ${activeDayIndex === idx ? 'active' : ''}`}
            onClick={() => setActiveDayIndex(idx)}
          >
            <div className="day-tab-info">
              <span className="day-tab-number">Day {day.dayNumber}</span>
              <span className="day-tab-title">{day.title}</span>
            </div>
            
            {itinerary.length > 1 && (
              <button 
                className="delete-day-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveDay(idx);
                }}
                title="Delete Day"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
      
      <button 
        onClick={onAddDay} 
        className="add-day-btn"
        style={{ marginTop: '0.5rem' }}
      >
        <Plus size={16} /> Add Day
      </button>
    </aside>
  );
}
