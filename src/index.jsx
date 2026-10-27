
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';

import './styles/style.css';
import './styles/components.css';
import './styles/forms.css';
import './styles/responsive.css';

const root = createRoot(document.getElementById('root'));

root.render(
  <LanguageProvider>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </LanguageProvider>,
);
