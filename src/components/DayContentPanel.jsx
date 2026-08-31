import { Plus } from 'lucide-react';
import StopCard from './StopCard';

export default function DayContentPanel({ 
  day, 
  dayIdx, 
  onUpdateHeader, 
  onUpdateStopField, 
  onRemoveStop, 
  onMoveStop, 
  onAddStop 
}) {
  return (
    <section className="day-content-panel">
      <div className="day-header">
        <input 
          type="text" 
          className="editable-input-title"
          value={day.title} 
          onChange={(e) => onUpdateHeader(dayIdx, 'title', e.target.value)} 
          placeholder="Title of this day"
        />
        <input 
          type="text" 
          className="editable-input-theme"
          value={day.theme} 
          onChange={(e) => onUpdateHeader(dayIdx, 'theme', e.target.value)} 
          placeholder="Day theme (e.g. Sightseeing, Food tour)"
        />
      </div>

      <div className="stops-timeline">
        {day.stops && day.stops.map((stop, stopIdx) => (
          <StopCard 
            key={stop.id}
            stop={stop}
            stopIdx={stopIdx}
            totalStops={day.stops.length}
            onUpdateField={(idx, field, val) => onUpdateStopField(dayIdx, idx, field, val)}
            onRemove={(idx) => onRemoveStop(dayIdx, idx)}
            onMove={(idx, dir) => onMoveStop(dayIdx, idx, dir)}
          />
        ))}

        {/* Trigger to add a stop */}
        <div className="add-stop-trigger-box">
          <button 
            onClick={() => onAddStop(dayIdx)}
            className="add-stop-btn"
          >
            <Plus size={14} /> Add Stop
          </button>
        </div>
      </div>

      <div className="decorations-container">
        <div className="washi-tape">
          📍 Day {day.dayNumber} Stops
        </div>
      </div>
    </section>
  );
}
