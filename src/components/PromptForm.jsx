import { Sparkles, RefreshCw } from 'lucide-react';

export default function PromptForm({ 
  prompt, 
  setPrompt, 
  onSubmit, 
  loading, 
  suggestions, 
  onSuggestionClick 
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(prompt);
  };

  return (
    <section className="input-section">
      <form onSubmit={handleSubmit}>
        <div className="textarea-container">
          <label htmlFor="trip-prompt" className="textarea-label">
            <Sparkles size={18} style={{ color: 'var(--color-warning)' }} /> Where are you traveling next?
          </label>
          <textarea
            id="trip-prompt"
            className="textarea-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. A 4-day relaxing trip to Bali with a budget of $800 focusing on beaches, local temples, and sunsets..."
            disabled={loading}
          />
        </div>
        
        <div className="button-row">
          <div className="suggestions-list">
            {suggestions.map((sug, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => onSuggestionClick(sug.text)}
                className="suggestion-chip"
                disabled={loading}
              >
                {sug.label}
              </button>
            ))}
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading || !prompt.trim()}
          >
            {loading ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} />}
            {loading ? 'Drafting...' : 'Plan Trip'}
          </button>
        </div>
      </form>
    </section>
  );
}
