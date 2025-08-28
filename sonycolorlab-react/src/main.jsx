import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/style.css';
import { AppProvider } from './context/AppContext.jsx';
import { initializeFirebase } from './services/api.js';

// Initialize Firebase once when the application starts
initializeFirebase();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
