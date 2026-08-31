import { AlertCircle, RefreshCw, Info } from 'lucide-react';

export default function ErrorBox({ 
  error, 
  onRetry, 
  onLoadDemo, 
  onStartFromScratch 
}) {
  return (
    <div className="error-box">
      <div className="error-header">
        <AlertCircle size={24} />
        <span>Generation Failed: {error.type}</span>
      </div>
      
      <p>{error.message}</p>
      
      {error.type === 'Missing API Key' && (
        <div 
          className="error-details" 
          style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}
        >
          <Info size={16} style={{ verticalAlign: 'middle', marginRight: '0.4rem' }} />
          <strong>Setup instruction:</strong> Please create a file named <code>.env</code> in the root of the project folder and insert your key:
          <br /><br />
          <code>GEMINI_API_KEY=your_actual_api_key_here</code>
          <br /><br />
          Once completed, restart the backend server with <code>npm start</code>.
        </div>
      )}
      
      <div className="error-actions">
        <button 
          onClick={onRetry} 
          className="btn btn-primary"
        >
          <RefreshCw size={16} /> Retry
        </button>
        <button 
          onClick={onLoadDemo} 
          className="btn btn-secondary"
        >
          🌸 Try Tokyo Demo
        </button>
        <button 
          onClick={onStartFromScratch} 
          className="btn btn-success"
        >
          📝 Start From Scratch
        </button>
      </div>
    </div>
  );
}
