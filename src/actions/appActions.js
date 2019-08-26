import superagent from 'superagent'

import { types } from './index'
import { setLanguage as i18nSetLanguage, t } from '../i18n'

export const init = (mode='production') => {
  return { type: types.INIT, mode }
}

export const startLoading = () => {
  return { type: types.START_LOADING }
}

export const stopLoading = () => {
  return { type: types.STOP_LOADING }
}

export const setLanguage = (language='ja') => {
  i18nSetLanguage(language);
  return { type: types.SET_LANGUAGE, language }
}

export const execute = (data) => (dispatch, getState) => {
  const state = getState()
  const { form } = state
  dispatch({ type: types.EXECUTE })
  setTimeout(() => {
    dispatch({
      type: types.COMPLETED,
      message: t(`completion.${form.outputMode}`, {
        projectId: form.outputProjectId,
        datasetId: form.outputDatasetId,
        tableId: form.outputTableId,
      })
    })
  }, 3000)
}

export const  closeAlert = () => {
  return { type: types.CLOSE_ALERT }
}