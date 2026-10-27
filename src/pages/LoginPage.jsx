
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useInput from '../hooks/useInput';
import { login, putAccessToken } from '../utils/network-data';
import { useLanguage } from '../contexts/LanguageContext';

function LoginPage({ onLoginSuccess }) {
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { t } = useLanguage();

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const result = await login({ email, password });

      if (result.error) {
        setErrorMessage(t('loginError'));
        return;
      }

      putAccessToken(result.data.accessToken);
      await onLoginSuccess();
      navigate('/');
    } catch {
      setErrorMessage(t('connectionError'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <header>
        <h1>{t('login')}</h1>
      </header>

      <form className="new-note-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">{t('email')}</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={onEmailChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">{t('password')}</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={onPasswordChange}
            required
          />
        </div>

        {errorMessage && <p role="alert">{errorMessage}</p>}

        <div className="form-actions">
          <button type="submit" className="save-button" disabled={loading}>
            {loading ? t('processing') : t('login')}
          </button>
        </div>
      </form>

      <p>
        {t('noAccount')} <Link to="/register">{t('registerHere')}</Link>
      </p>
    </main>
  );
}

export default LoginPage;
