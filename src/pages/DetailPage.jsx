
import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { showFormattedDate } from '../utils';
import { useLanguage } from '../contexts/LanguageContext';

function DetailPage({
  notes,
  onDeleteNote,
  onArchiveNote,
  onUnarchiveNote,
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const note = notes.find((item) => item.id === id);

  if (!note) {
    return (
      <main>
        <header>
          <h1>{t('notFound')}</h1>
          <Link to="/">{t('activeNotes')}</Link>
        </header>
      </main>
    );
  }

  async function handleDelete() {
    const confirmed = window.confirm(t('confirmDelete'));

    if (!confirmed) return;

    setLoading(true);
    setErrorMessage('');

    try {
      await onDeleteNote(note.id);
      navigate('/', { replace: true });
    } catch (error) {
      setErrorMessage(
        error.message || t('deleteError')
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleArchive() {
    setLoading(true);
    setErrorMessage('');

    try {
      if (note.archived) {
        await onUnarchiveNote(note.id);
        navigate('/', { replace: true });
      } else {
        await onArchiveNote(note.id);
        navigate('/archive', { replace: true });
      }
    } catch (error) {
      setErrorMessage(
        error.message || t('archiveError')
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <header>
        <h1>{t('detail')}</h1>
        <Link to={note.archived ? '/archive' : '/'}>
          {t('back')}
        </Link>
      </header>

      {errorMessage && (
        <p role="alert">{errorMessage}</p>
      )}

      <article className="detail-note-card">
        <h2 className="detail-page__title">{note.title}</h2>

        <p className="note-item__createdAt">
          {showFormattedDate(note.createdAt, language)}
        </p>

        <div className="detail-page__body">{note.body}</div>

        <p className="detail-note-status">
          {t('status')}: {note.archived ? t('archived') : t('active')}
        </p>

        <div className="detail-note-actions">
          <button
            type="button"
            className="action-button-secondary"
            style={{
                  alignSelf: 'flex-start',
                  width: 'auto',
                  minWidth: '80px',
                  marginTop: '8px',
                }}
            onClick={handleArchive}
            disabled={loading}
          >
            {loading
              ? t('processing')
              : note.archived
                ? t('unarchive')
                : t('archiveAction')}
          </button>

          <button
            type="button"
            className="delete-button"
            style={{
                  alignSelf: 'flex-start',
                  width: 'auto',
                  minWidth: '80px',
                  marginTop: '8px',
                }}
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? t('processing') : t('delete')}
          </button>
        </div>
      </article>
    </main>
  );
}

export default DetailPage;
