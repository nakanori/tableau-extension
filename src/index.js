import $ from 'jquery';
import _ from 'lodash';
import Logger from 'js-logger';
import { setLanguage } from './i18n';
import { init as initLogger } from './logger';

import './styles/index.scss';
import '../lib/tableau-extensions-1.latest.js';

$(window).on("load",function() {
  console.debug("window onload")
  initLogger();
  setLanguage();
  
});