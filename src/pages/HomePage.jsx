
import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { showFormattedDate } from '../utils';
import { useLanguage } from '../contexts/LanguageContext';

function HomePage({ notes, onDeleteNote, onArchiveNote }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [deletingId, setDeletingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const { t, language } = useLanguage();

  const keyword = searchParams.get('keyword') || '';

  // Hanya tampilkan catatan yang belum diarsipkan.
  const activeNotes = notes.filter((note) => !note.archived);

  // Filter catatan berdasarkan judul dan isi.
  const filteredNotes = activeNotes.filter((note) => {
    const searchKeyword = keyword.toLowerCase();

    return (
      note.title.toLowerCase().includes(searchKeyword) ||
      note.body.toLowerCase().includes(searchKeyword)
    );
  });

  function handleSearch(event) {
    const value = event.target.value;

    if (value) {
      setSearchParams({ keyword: value });
    } else {
      setSearchParams({});
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(t('confirmDelete'));

    if (!confirmed) return;

    setDeletingId(id);
    setErrorMessage('');

    try {
      await onDeleteNote(id);
    } catch (error) {
      setErrorMessage(error.message || t('deleteError'));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main>
      <header>
        <h1>{t('appName')}</h1>
        <Link to="/archive">{t('archive')}</Link>
      </header>

      <div className="search-bar">
        <input
          type="search"
          placeholder={t('searchPlaceholder')}
          value={keyword}
          onChange={handleSearch}
          aria-label={t('searchLabel')}
        />
      </div>

      <div className="homepage__action">
        <Link
          to="/notes/new"
          className="action-button"
          aria-label={t('addNote')}
          title={t('addNote')}
        >
          +
        </Link>
      </div>

      {errorMessage && (
        <p role="alert">{errorMessage}</p>
      )}

      {filteredNotes.length === 0 ? (
        <div className="notes-list-empty">
          <p>
            {keyword
              ? t('notFound')
              : t('noNotes')}
          </p>
        </div>
      ) : (
        <div className="notes-list">
          {filteredNotes.map((note) => (
            <div key={note.id} className="note-card">
              <Link
                to={`/notes/${note.id}`}
                className="note-item"
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
                    className="action-button-secondary"
                    onClick={async () => {
                      try {
                        await onArchiveNote(note.id);
                      } catch (error) {
                        window.alert(error.message || t('archiveError'));
                      }
                    }}
                  >
                    {t('archiveAction')}
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleDelete(note.id)}
                    disabled={deletingId === note.id}
                  >
                    {deletingId === note.id
                      ? t('deleting')
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

export default HomePage;
