const fs = require('fs');
const Mustache = require('mustache');
const versions = require('./versions.json');

const file = 'index.mustache';
const template = fs.readFileSync(file, 'utf8');
Mustache.parse(template);
const values = {};
values.ads = fs.readFileSync('./_ads.html', 'utf-8');
const parser = require('ua-parser');
const compareVersions = require('compare-versions');

const browsers = Object.keys(versions);

module.exports = function check(req) {
  // get user-agent header
  const userAgent = req.headers['user-agent'];
  const ua = parser.parse(userAgent);
  // write the result as response
  const browserId = ua.family.toLowerCase();
  values.browserVersion = ua.toVersionString();
  values.browserName = ua.family;
  values.browsers = browsers.join(', ');
  values.isSupported = versions[browserId] !== undefined;
  values.version = versions[browserId];
  const versionCheck = compareVersions(values.browserVersion, values.version);
  values.isUpToDate = (versionCheck >= 0) ? 'yes' : 'no';
  const rendered = Mustache.render(template, values);
  return rendered;
};
