
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

const LanguageContext = createContext();

const translations = {
  id: {
    appName: 'Catatan Pribadi',
    login: 'Masuk',
    logout: 'Keluar',
    register: 'Daftar Akun',
    email: 'Email',
    password: 'Password',
    name: 'Nama',
    confirmPassword: 'Konfirmasi Password',
    noAccount: 'Belum punya akun?',
    hasAccount: 'Sudah punya akun?',
    registerHere: 'Daftar di sini',
    loginHere: 'Masuk di sini',
    loginAs: 'Masuk sebagai',
    archive: 'Catatan Arsip',
    activeNotes: 'Kembali ke catatan aktif',
    searchPlaceholder: 'Cari judul atau isi catatan...',
    searchLabel: 'Cari catatan',
    addNote: 'Tambah catatan',
    archivedNotes: 'Catatan Arsip',
    backToActiveNotes: 'Kembali ke catatan aktif',
    unarchiveError: 'Gagal membatalkan arsip. Silakan coba lagi.',
    notFound: 'Catatan tidak ditemukan.',
    noNotes: 'Tidak ada catatan.',
    noArchivedNotes: 'Belum ada catatan yang diarsipkan.',
    delete: 'Hapus',
    deleting: 'Menghapus...',
    confirmDelete: 'Yakin ingin menghapus catatan ini?',
    detail: 'Detail Catatan',
    back: 'Kembali',
    status: 'Status',
    active: 'Aktif',
    archived: 'Diarsipkan',
    archiveAction: 'Arsipkan',
    unarchive: 'Batal Arsip',
    processing: 'Memproses...',
    newNote: 'Buat Catatan Baru',
    description: 'Tuangkan ide dan hal pentingmu di sini.',
    noteTitle: 'Judul catatan',
    noteBody: 'Isi catatan',
    titlePlaceholder: 'Contoh: Ide skripsi',
    bodyPlaceholder: 'Mulai tulis catatanmu...',
    cancel: 'Batal',
    save: 'Simpan Catatan',
    saving: 'Menyimpan...',
    requiredFields: 'Judul dan isi catatan wajib diisi.',
    loginError: 'Login gagal. Periksa email dan password.',
    connectionError: 'Terjadi kesalahan koneksi. Coba lagi.',
    registerError: 'Registrasi gagal. Periksa kembali data kamu.',
    passwordMismatch: 'Konfirmasi password tidak cocok.',
    deleteError: 'Gagal menghapus catatan. Silakan coba lagi.',
    archiveError: 'Gagal mengubah status arsip. Silakan coba lagi.',
    loadError: 'Gagal memuat catatan dari server.',
    saveError: 'Gagal menyimpan catatan. Silakan coba lagi.',
    retry: 'Coba lagi',
    checkingSession: 'Memeriksa sesi pengguna...',
    loadingNotes: 'Memuat catatan...',
    notFoundPage: 'Halaman Tidak Ditemukan',
    language: 'Bahasa',
    switchLanguage: 'Ganti bahasa',
    themeDark: 'Aktifkan tema gelap',
    themeLight: 'Aktifkan tema terang',
  },
  en: {
    appName: 'Personal Notes',
    login: 'Login',
    logout: 'Logout',
    register: 'Create Account',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    confirmPassword: 'Confirm Password',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    registerHere: 'Register here',
    loginHere: 'Login here',
    loginAs: 'Logged in as',
    archive: 'Archived Notes',
    activeNotes: 'Back to active notes',
    searchPlaceholder: 'Search note title or content...',
    searchLabel: 'Search notes',
    addNote: 'Add note',
    archivedNotes: 'Archived Notes',
    backToActiveNotes: 'Back to active notes',
    unarchiveError: 'Failed to unarchive note. Please try again.',
    notFound: 'No notes found.',
    noNotes: 'No notes yet.',
    noArchivedNotes: 'There are no archived notes yet.',
    delete: 'Delete',
    deleting: 'Deleting...',
    confirmDelete: 'Are you sure you want to delete this note?',
    detail: 'Note Details',
    back: 'Back',
    status: 'Status',
    active: 'Active',
    archived: 'Archived',
    archiveAction: 'Archive',
    unarchive: 'Unarchive',
    processing: 'Processing...',
    newNote: 'Create a New Note',
    description: 'Write down your ideas and important things here.',
    noteTitle: 'Note title',
    noteBody: 'Note content',
    titlePlaceholder: 'Example: Thesis ideas',
    bodyPlaceholder: 'Start writing your note...',
    cancel: 'Cancel',
    save: 'Save Note',
    saving: 'Saving...',
    requiredFields: 'Note title and content are required.',
    loginError: 'Login failed. Check your email and password.',
    connectionError: 'Connection error. Please try again.',
    registerError: 'Registration failed. Please check your details.',
    passwordMismatch: 'Passwords do not match.',
    deleteError: 'Failed to delete note. Please try again.',
    archiveError: 'Failed to update archive status. Please try again.',
    loadError: 'Failed to load notes from the server.',
    saveError: 'Failed to save note. Please try again.',
    retry: 'Retry',
    checkingSession: 'Checking user session...',
    loadingNotes: 'Loading notes...',
    notFoundPage: 'Page Not Found',
    language: 'Language',
    switchLanguage: 'Change language',
    themeDark: 'Enable dark theme',
    themeLight: 'Enable light theme',
  },
};

function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage === 'en' ? 'en' : 'id';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  function toggleLanguage() {
    setLanguage((currentLanguage) =>
      currentLanguage === 'id' ? 'en' : 'id'
    );
  }

  function t(key) {
    return translations[language][key] || key;
  }

  return (
    <LanguageContext.Provider
      value={{ language, toggleLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

function useLanguage() {
  return useContext(LanguageContext);
}

export { LanguageProvider, useLanguage };
