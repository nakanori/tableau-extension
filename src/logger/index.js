import Logger from 'js-logger';

export const init = (mode=process.env.NODE_ENV) => {
  Logger.useDefaults();
  Logger.setLevel(mode === 'production' ? Logger.WARN : Logger.DEBUG);
}
