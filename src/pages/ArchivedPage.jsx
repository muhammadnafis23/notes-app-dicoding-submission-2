
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { showFormattedDate } from '../utils';
import { useLanguage } from '../contexts/LanguageContext';

function ArchivedPage({
  notes,
  onUnarchiveNote,
  onDeleteNote,
}) {
  const [processingId, setProcessingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { t, language } = useLanguage();

  const archivedNotes = notes.filter((note) => {
    if (!note.archived) return false;

    const query = searchQuery.trim().toLowerCase();

    return (
      note.title.toLowerCase().includes(query) ||
      note.body.toLowerCase().includes(query)
    );
  });

  async function handleUnarchive(id) {
    setProcessingId(id);
    setErrorMessage('');

    try {
      await onUnarchiveNote(id);
    } catch (error) {
      setErrorMessage(error.message || t('unarchiveError'));
    } finally {
      setProcessingId(null);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(t('confirmDelete'));

    if (!confirmed) return;

    setProcessingId(id);
    setErrorMessage('');

    try {
      await onDeleteNote(id);
    } catch (error) {
      setErrorMessage(error.message || t('deleteError'));
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <main>
      <header>
        <h1>{t('archivedNotes')}</h1>

        <Link to="/" className="archive-link">
          {t('backToActiveNotes')}
        </Link>
      </header>

      <div className="search-bar">
        <input
          type="search"
          placeholder={t('searchPlaceholder')}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          aria-label={t('searchLabel')}
        />
      </div>

      {errorMessage && (
        <p role="alert">{errorMessage}</p>
      )}

      {archivedNotes.length === 0 ? (
        <div className="notes-list-empty">
          <p>
            {searchQuery.trim()
              ? t('notFound')
              : t('noArchivedNotes')}
          </p>
        </div>
      ) : (
        <div className="notes-list">
          {archivedNotes.map((note) => (
            <div className="note-card" key={note.id}>
              <Link
                to={`/notes/${note.id}`}
                className="note-item"
                style={{
                  display: 'block',
                  textDecoration: 'none',
                }}
              >
                <h2 className="note-item__title">
                  {note.title}
                </h2>

                <p className="note-item__createdAt">
                  {showFormattedDate(note.createdAt, language)}
                </p>

                <p className="note-item__body">
                  {note.body}
                </p>
              </Link>

              <div className="note-actions">
                <button
                  type="button"
                  className="unarchive-button"
                  onClick={() => handleUnarchive(note.id)}
                  disabled={processingId === note.id}
                >
                  {processingId === note.id
                    ? t('processing')
                    : t('unarchive')}
                </button>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() => handleDelete(note.id)}
                  disabled={processingId === note.id}
                >
                  {processingId === note.id
                    ? t('processing')
                    : t('delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default ArchivedPage;
