import ja from './ja';

const i18n = {
  ja: ja,
}

let currentLang = 'ja';

export const setLanguage = (language='ja') => {
  currentLang = language;
}

export const t = (key) => {
  return (i18n[currentLang] && i18n[currentLang][key]) || key;
}
