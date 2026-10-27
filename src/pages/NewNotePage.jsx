
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

function NewNotePage({ onAddNote }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const { t } = useLanguage();

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();

    if (!trimmedTitle || !trimmedBody) {
      setErrorMessage(t('requiredFields'));
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      await onAddNote({
        title: trimmedTitle,
        body: trimmedBody,
      });

      navigate('/');
    } catch (error) {
      setErrorMessage(
        error.message || t('saveError')
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <header>
        <h1>{t('newNote')}</h1>
        <Link to="/">{t('back')}</Link>
      </header>

      <p className="new-note-description">
        {t('description')}
      </p>

      <form className="new-note-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">{t('noteTitle')}</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={t('titlePlaceholder')}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="body">{t('noteBody')}</label>
          <textarea
            id="body"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder={t('bodyPlaceholder')}
            rows={10}
            required
            disabled={loading}
          />
        </div>

        {errorMessage && (
          <p role="alert">{errorMessage}</p>
        )}

        <div className="form-actions">
          <Link
            to="/"
            className="cancel-button"
            aria-disabled={loading}
            onClick={(event) => {
              if (loading) event.preventDefault();
            }}
          >
            {t('cancel')}
          </Link>

          <button
            type="submit"
            className="save-button"
            disabled={loading}
          >
            {loading ? t('saving') : t('save')}
          </button>
        </div>
      </form>
    </main>
  );
}

export default NewNotePage;
