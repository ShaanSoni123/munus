import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './types/google.d.ts';

// Load Google APIs
const loadGoogleAPIs = () => {
  // Google Identity Services library (for OAuth 2.0)
  const oauthScript = document.createElement('script');
  oauthScript.src = 'https://accounts.google.com/gsi/client';
  oauthScript.async = true;
  oauthScript.defer = true;
  oauthScript.onload = () => {
    console.log('✅ Google Identity Services loaded successfully');
  };
  oauthScript.onerror = (error) => {
    console.error('❌ Failed to load Google Identity Services:', error);
  };
  document.head.appendChild(oauthScript);

  // Google API client library (for other Google APIs)
  const gapiScript = document.createElement('script');
  gapiScript.src = 'https://apis.google.com/js/api.js';
  gapiScript.async = true;
  gapiScript.defer = true;
  gapiScript.onload = () => {
    console.log('✅ Google API client loaded successfully');
  };
  gapiScript.onerror = (error) => {
    console.error('❌ Failed to load Google API client:', error);
  };
  document.head.appendChild(gapiScript);
};

// Apply dark theme by default
document.documentElement.classList.add('dark');
document.body.classList.add('dark');

// Load Google APIs when the app starts
loadGoogleAPIs();

// Simple fallback component for testing
const FallbackApp = () => {
  console.log('🔄 FallbackApp rendering...');
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: 'red', fontSize: '24px' }}>🚀 React is working!</h1>
      <p>If you can see this, React is rendering correctly.</p>
      <p>Current time: {new Date().toLocaleString()}</p>
      <button 
        onClick={() => alert('React is working!')}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: 'blue', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Test Button
      </button>
    </div>
  );
};

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('❌ Root element not found!');
  document.body.innerHTML = '<h1 style="color: red; padding: 20px;">Error: Root element not found!</h1>';
} else {
  console.log('✅ Root element found, creating React app...');
  
  try {
    const root = createRoot(rootElement);
    
    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.warn('⚠️ App taking too long to load, showing fallback...');
      root.render(
        <StrictMode>
          <FallbackApp />
        </StrictMode>
      );
    }, 10000); // 10 second timeout
    
    // Try to render the main app first
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    
    // Clear timeout if app loads successfully
    clearTimeout(timeoutId);
    console.log('✅ React app rendered successfully');
  } catch (error) {
    console.error('❌ Error rendering React app:', error);
    
    // Fallback to simple component
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <FallbackApp />
      </StrictMode>
    );
  }
}
