
import React, { useCallback, useEffect, useState } from 'react';
import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import NewNotePage from './pages/NewNotePage';
import ArchivedPage from './pages/ArchivedPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import Navbar from './components/Navbar';
import { useLanguage } from './contexts/LanguageContext';

import {
  getAccessToken,
  getUserLogged,
  getActiveNotes,
  getArchivedNotes,
  addNote,
  deleteNote,
  archiveNote,
  unarchiveNote,
} from './utils/network-data';

function App() {
  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesError, setNotesError] = useState('');
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const { t } = useLanguage();

  // Memuat catatan aktif dan arsip dari API.
  const loadNotes = useCallback(async () => {
    setNotesLoading(true);
    setNotesError('');

    try {
      const [activeResult, archivedResult] = await Promise.all([
        getActiveNotes(),
        getArchivedNotes(),
      ]);

      if (activeResult.error || archivedResult.error) {
        setNotesError(t('loadError'));
        return false;
      }

      setNotes([
        ...activeResult.data,
        ...archivedResult.data,
      ]);

      return true;
    } catch {
      setNotesError(t('connectionError'));
      return false;
    } finally {
      setNotesLoading(false);
    }
  }, [t]);

  // Memulihkan sesi saat aplikasi dibuka atau di-refresh.
  useEffect(() => {
    async function restoreSession() {
      const token = getAccessToken();

      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        const result = await getUserLogged();

        if (result.error) {
          localStorage.removeItem('accessToken');
          setUser(null);
          return;
        }

        setUser(result.data);
        await loadNotes();
      } catch {
        setNotesError(t('connectionError'));
      } finally {
        setAuthLoading(false);
      }
    }

    restoreSession();
  }, [loadNotes, t]);

  // Dipanggil setelah login berhasil.
  async function handleLoginSuccess() {
    const result = await getUserLogged();

    if (result.error) {
      localStorage.removeItem('accessToken');
      setUser(null);
      throw new Error('Gagal mengambil data pengguna.');
    }

    setUser(result.data);
    await loadNotes();
  }

  // Keluar dari akun.
  function handleLogout() {
    localStorage.removeItem('accessToken');
    setUser(null);
    setNotes([]);
    setNotesError('');
  }

  // Menambahkan catatan melalui API.
  async function handleAddNote({ title, body }) {
    const result = await addNote({ title, body });

    if (result.error) {
      throw new Error('Gagal menambahkan catatan.');
    }

    const loaded = await loadNotes();

    if (!loaded) {
      throw new Error(
        'Catatan berhasil dikirim, tetapi daftar gagal dimuat ulang.'
      );
    }
  }

  // Menghapus catatan melalui API.
  async function handleDeleteNote(id) {
    const result = await deleteNote(id);

    if (result.error) {
      throw new Error('Gagal menghapus catatan.');
    }

    const loaded = await loadNotes();

    if (!loaded) {
      throw new Error(
        'Catatan berhasil dihapus, tetapi daftar gagal dimuat ulang.'
      );
    }
  }

  // Mengarsipkan catatan melalui API.
  async function handleArchiveNote(id) {
    const result = await archiveNote(id);

    if (result.error) {
      throw new Error('Gagal mengarsipkan catatan.');
    }

    const loaded = await loadNotes();

    if (!loaded) {
      throw new Error(
        'Catatan berhasil diarsipkan, tetapi daftar gagal dimuat ulang.'
      );
    }
  }

  // Membatalkan arsip melalui API.
  async function handleUnarchiveNote(id) {
    const result = await unarchiveNote(id);

    if (result.error) {
      throw new Error('Gagal membatalkan arsip catatan.');
    }

    const loaded = await loadNotes();

    if (!loaded) {
      throw new Error(
        'Status arsip berhasil diubah, tetapi daftar gagal dimuat ulang.'
      );
    }
  }

  // Menunggu pemeriksaan sesi selesai.
  if (authLoading) {
    return (
      <div className="app-container">
        <p role="status">{t('checkingSession')}</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Navbar digunakan bersama di seluruh halaman. */}
      <Navbar user={user} onLogout={handleLogout} />

      {user && notesLoading && (
        <p role="status">{t('loadingNotes')}</p>
      )}

      {user && notesError && (
        <p role="alert">
          {notesError}{' '}
          <button type="button" onClick={loadNotes}>
            {t('retry')}
          </button>
        </p>
      )}

      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <LoginPage onLoginSuccess={handleLoginSuccess} />
            )
          }
        />

        <Route
          path="/register"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <RegisterPage />
            )
          }
        />

        <Route
          path="/"
          element={
            user ? (
              <HomePage
                notes={notes}
                onDeleteNote={handleDeleteNote}
                onArchiveNote={handleArchiveNote}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/notes/new"
          element={
            user ? (
              <NewNotePage onAddNote={handleAddNote} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/notes/:id"
          element={
            user ? (
              <DetailPage
                notes={notes}
                onDeleteNote={handleDeleteNote}
                onArchiveNote={handleArchiveNote}
                onUnarchiveNote={handleUnarchiveNote}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/archive"
          element={
            user ? (
              <ArchivedPage
                notes={notes}
                onUnarchiveNote={handleUnarchiveNote}
                onDeleteNote={handleDeleteNote}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="*"
          element={<h1>{t('notFoundPage')}</h1>}
        />
      </Routes>
    </div>
  );
}

export default App;
