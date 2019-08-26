import { types } from '../actions/index'

export const createReducer = (initialState, handlers) => {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
}

const status = {
  NONE: 'NONE',
  EXECUTING: 'EXECUTING',
  COMPLETED: 'COMPLETED',
}

const initialState = {
  loading: false,
  mode: 'production',
  language: 'ja',
  status: status.NONE,
  showAlert: false,
  alertMessage: null,
}

const updateMode = (state, action) => {
  return {
    ...state,
    mode: action.mode
  }
}

const startLoading = state => {
  return {
    ...state,
    loading: true,
  }
}

const stopLoading = state => {
  return {
    ...state,
    loading: false,
  }
}

const updateLanguage = (state, action) => {
  return {
    ...state,
    language: action.language
  }
}

const execute = (state, action) => {
  return {
    ...state,
    status: status.EXECUTING,
    showAlert: false,
  }
}

const completed = (state, action) => {
  const { message } = action
  return {
    ...state,
    status: status.COMPLETED,
    showAlert: true,
    alertMessage: message,
  }
}

const closeAlert = (state, action) => {
  return {
    ...state,
    showAlert: false,
  }
}

const app = createReducer(initialState, {
  [types.INIT]: updateMode,
  [types.START_LOADING]: startLoading,
  [types.STOP_LOADING]: stopLoading,
  [types.SET_LANGUAGE]: updateLanguage,
  [types.EXECUTE]: execute,
  [types.COMPLETED]: completed,
  [types.CLOSE_ALERT]: closeAlert,
})

export default app
