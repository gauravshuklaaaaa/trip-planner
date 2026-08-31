import { Menu, Plus, Compass } from 'lucide-react';

export default function Header({ onMenuToggle, onNewTrip }) {
  return (
    <header className="app-header">
      <div className="header-left">
        <button 
          className="menu-toggle-btn no-print" 
          onClick={onMenuToggle} 
          title="Open trip history sidebar"
        >
          <Menu size={22} />
        </button>
        <div className="header-brand">
          <Compass className="brand-icon text-accent" />
          <h1 className="brand-title">
            TRIP <span className="accent">PLANNER</span>
          </h1>
        </div>
      </div>
      
      <button 
        className="mobile-new-trip-btn no-print" 
        onClick={onNewTrip} 
        title="Start a new trip planner"
      >
        <Plus size={20} />
        <span>New Trip</span>
      </button>
    </header>
  );
}
