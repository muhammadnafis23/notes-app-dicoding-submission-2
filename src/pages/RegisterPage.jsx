
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useInput from '../hooks/useInput';
import { register } from '../utils/network-data';
import { useLanguage } from '../contexts/LanguageContext';

function RegisterPage() {
  const [name, onNameChange] = useInput('');
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  const [confirmPassword, onConfirmPasswordChange] = useInput('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { t } = useLanguage();

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage(t('passwordMismatch'));
      return;
    }

    setLoading(true);

    try {
      const result = await register({ name, email, password });

      if (result.error) {
        setErrorMessage(t('registerError'));
        return;
      }

      navigate('/login', {
        state: { registered: true },
      });
    } catch {
      setErrorMessage(t('connectionError'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <header>
        <h1>{t('register')}</h1>
      </header>

      <form className="new-note-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">{t('name')}</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={onNameChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="register-email">{t('email')}</label>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={onEmailChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="register-password">{t('password')}</label>
          <input
            id="register-password"
            type="password"
            value={password}
            onChange={onPasswordChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirm-password">
            {t('confirmPassword')}
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={onConfirmPasswordChange}
            required
          />
        </div>

        {errorMessage && <p role="alert">{errorMessage}</p>}

        <div className="form-actions">
          <button type="submit" className="save-button" disabled={loading}>
            {loading ? t('processing') : t('register')}
          </button>
        </div>
      </form>

      <p>
        {t('hasAccount')} <Link to="/login">{t('loginHere')}</Link>
      </p>
    </main>
  );
}

export default RegisterPage;
