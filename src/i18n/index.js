​import _ from 'lodash'
import ja from './ja';
import en from './en';

const i18n = {
  ja: ja,
  en: en,
}

let currentLang = 'ja';

export const setLanguage = (language='ja') => {
  currentLang = language;
}

export const t = (key, templateParams={}) => {
  if (i18n[currentLang]) {
    const message = _.get(i18n[currentLang], key)
    if (_.isFunction(message)) {
      return message(templateParams)
    } else {
      return message
    }
  } else {
    return key;
  }
}
