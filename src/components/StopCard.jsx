import { ArrowUp, ArrowDown, Trash2, MapPin, Clock, DollarSign } from 'lucide-react';

export default function StopCard({ 
  stop, 
  stopIdx, 
  totalStops, 
  onUpdateField, 
  onRemove, 
  onMove 
}) {
  return (
    <div className="stop-card">
      <div className="stop-dot"></div>
      
      <div className="stop-card-header">
        <select 
          value={stop.time}
          onChange={(e) => onUpdateField(stopIdx, 'time', e.target.value)}
          className="stop-time-tag"
          style={{ outline: 'none', border: 'none', cursor: 'pointer' }}
        >
          <option value="Morning">Morning 🌅</option>
          <option value="Afternoon">Afternoon ☀️</option>
          <option value="Evening">Evening 🌇</option>
          <option value="Night">Night 🌙</option>
          <option value="Flexible">Flexible 🎒</option>
        </select>
        
        <div className="stop-controls">
          <button 
            className="control-btn"
            onClick={() => onMove(stopIdx, 'up')}
            disabled={stopIdx === 0}
            title="Move stop up"
          >
            <ArrowUp size={14} />
          </button>
          
          <button 
            className="control-btn"
            onClick={() => onMove(stopIdx, 'down')}
            disabled={stopIdx === totalStops - 1}
            title="Move stop down"
          >
            <ArrowDown size={14} />
          </button>
          
          <button 
            className="control-btn delete"
            onClick={() => onRemove(stopIdx)}
            title="Delete stop"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Editable activity titles and details */}
      <div className="stop-title-row">
        <input 
          type="text" 
          className="editable-stop-activity"
          value={stop.activity} 
          onChange={(e) => onUpdateField(stopIdx, 'activity', e.target.value)}
          placeholder="Activity title"
        />
        <textarea 
          className="editable-stop-description"
          value={stop.description} 
          onChange={(e) => onUpdateField(stopIdx, 'description', e.target.value)}
          placeholder="Describe what you plan to do, sights to see, or notes on booking."
        />
      </div>

      {/* Location, cost and duration metadata */}
      <div className="stop-meta-grid">
        <div className="stop-meta-item">
          <MapPin size={14} className="stop-meta-icon" />
          <input 
            type="text" 
            className="editable-meta-input"
            value={stop.location} 
            onChange={(e) => onUpdateField(stopIdx, 'location', e.target.value)}
            placeholder="Location address"
          />
        </div>
        
        <div className="stop-meta-item">
          <Clock size={14} className="stop-meta-icon" />
          <input 
            type="text" 
            className="editable-meta-input"
            value={stop.duration} 
            onChange={(e) => onUpdateField(stopIdx, 'duration', e.target.value)}
            placeholder="Duration (e.g. 2 hours)"
          />
        </div>

        <div className="stop-meta-item">
          <DollarSign size={14} className="stop-meta-icon" />
          <input 
            type="text" 
            className="editable-meta-input"
            value={stop.cost} 
            onChange={(e) => onUpdateField(stopIdx, 'cost', e.target.value)}
            placeholder="Cost (e.g. Free, $15)"
          />
        </div>
      </div>
    </div>
  );
}
