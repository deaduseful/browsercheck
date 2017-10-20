const fs = require('fs');
const Mustache = require('mustache');
const versions = require('./versions.json');
const browsers = require('./browsers.json');
const config = require('./config.json');
const parser = require('ua-parser');
const compareVersions = require('compare-versions');
const style = require('./static/style.css');

const file = 'index.mustache';
const template = fs.readFileSync(file, 'utf8');
Mustache.parse(template);
const values = config;
values.ads = fs.readFileSync('_ads.html', 'utf-8');
const browserList = Object.keys(versions);
values.dateYear = (new Date()).getFullYear();
module.exports = function check(userAgent) {
  const ua = parser.parse(userAgent);
  const browserId = ua.family.toLowerCase();
  values.browserId = browserId;
  values.browserUrl = versions;
  values.browserVersion = ua.toVersionString();
  values.browserName = ua.family;
  values.browsersList = browserList.join(', ');
  const isSupported = versions[browserId] !== undefined;
  values.isUpToDate = 'unknown';
  if (isSupported) {
    values.isSupported = isSupported;
    values.browserUrl = browsers[browserId].url;
    values.version = versions[browserId];
    const versionCheck = compareVersions(values.browserVersion, values.version);
    values.versionCheck = (versionCheck >= 0);
    values.isUpToDate = (versionCheck >= 0) ? 'yes' : 'no';
  } else {
    console.log(`Unsupported browser: ${browserId}`);
  }
  values.style = style;
  const rendered = Mustache.render(template, values);
  return rendered;
};
