import { combineReducers } from 'redux'
import app from './appReducers'
import form from './formReducers'
import lastAction from './lastAction';

const rootReducer = combineReducers({
  app,
  form,
  lastAction,
})

// export {
//   createReducer,
//   rootReducer as default,
// }

export default rootReducer
