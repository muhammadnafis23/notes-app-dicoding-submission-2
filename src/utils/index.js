
const showFormattedDate = (date, language = 'id') => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const locale = language === 'en' ? 'en-US' : 'id-ID';

  return new Date(date).toLocaleDateString(locale, options);
};

export { showFormattedDate };
