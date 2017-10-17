const fs = require('fs');
const Mustache = require('mustache');
const versions = require('./versions.json');
const browsers = require('./browsers.json');
const config = require('./config.json');
const parser = require('ua-parser');
const compareVersions = require('compare-versions');

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
  values.browserUrl = browsers[browserId].url;
  values.isSupported = versions[browserId] !== undefined;
  values.version = versions[browserId];
  const versionCheck = compareVersions(values.browserVersion, values.version);
  values.versionCheck = (versionCheck >= 0);
  values.isUpToDate = (versionCheck >= 0) ? 'yes' : 'no';
  const rendered = Mustache.render(template, values);
  return rendered;
};
