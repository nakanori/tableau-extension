import Logger from 'js-logger'

export const init = mode => {
  Logger.useDefaults()
  Logger.setLevel(mode === 'production' ? Logger.WARN : Logger.DEBUG)
}
