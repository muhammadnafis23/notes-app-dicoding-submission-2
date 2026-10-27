
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

function Navbar({ user, onLogout }) {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();

  function handleLogout() {
    onLogout();
    navigate('/login', { replace: true });
  }

  return (
    <nav className="account-header">
      {user && (
        <span>
          {t('loginAs')} {user.name || user.email}
        </span>
      )}

      <button
        type="button"
        className="toggle-theme"
        onClick={toggleTheme}
        aria-label={
          theme === 'light'
            ? t('themeDark')
            : t('themeLight')
        }
        title={
          theme === 'light'
            ? t('themeDark')
            : t('themeLight')
        }
      >
        {theme === 'light' ? (
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.42 1.42" />
            <path d="m17.65 17.65 1.42 1.42" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.35 17.65-1.42 1.42" />
            <path d="m19.07 4.93-1.42 1.42" />
          </svg>
        )}
      </button>

      <button
        type="button"
        className="toggle-locale"
        onClick={toggleLanguage}
        aria-label={t('switchLanguage')}
        title={t('switchLanguage')}
      >
        {language === 'id' ? 'EN' : 'ID'}
      </button>

      {user && (
        <button
          type="button"
          className="button-logout"
          onClick={handleLogout}
        >
          {t('logout')}
        </button>
      )}
    </nav>
  );
}

export default Navbar;
