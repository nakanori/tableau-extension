import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'

import rootReducer from '../reducers'
import { init as initLogger } from '../logger'

function configureStore() {
  initLogger(process.env.NODE_ENV);

  let middleware = [thunk]
  let store = null;
  if (process.env.NODE_ENV === 'production') {
    store = createStore(rootReducer, applyMiddleware(...middleware))
  } else {
    const logger = createLogger();
    middleware.push(logger)
    store = createStore(rootReducer, applyMiddleware(...middleware))
  }
  return store
}
const store = configureStore()
export default store