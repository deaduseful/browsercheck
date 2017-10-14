var wikipediaUrl = 'http://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=Template:Latest_stable_software_release/';
var inputFile = 'browsers.json';
var outputFile = 'versions.json';
var maxAge = 3 * 7 * 24 * 60 * 60;
var matchVersion = /(?:version1|latest[_ ]release[_ ]version) ?= ?([\d][\d\.]+)/
var versions = {};
var browserData;
var browserFile;

var rp = require('request-promise');
const fs = require('fs');

function fetchVersions() {
  var browsers = readFile(inputFile);
  Object.keys(browsers).forEach(function(key, idx, array) {
    var browser = browsers[key];
    fragment = browser['wikipedia'];
    normalized = browser['normalized'];
    url = wikipediaUrl + fragment;
    rp(url)
      .then(function(htmlString) {
        var found = htmlString.match(matchVersion);
        version = normalizeVersion(found[1], normalized);
        versions[key] = version;
        if (idx === array.length - 1) {
          fileContent = JSON.stringify(versions);
          fs.writeFile(outputFile, fileContent, (err) => {
            if (err) {
              console.error(err);
              return;
            };
            console.log("File has been created");
          });
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  });
}

function readFile(file) {
  var fs = require('fs');
  var obj = JSON.parse(fs.readFileSync(file, 'utf8'));
  return obj;
}

function normalizeVersion(version, normalize) {
  var arr = version.split(".");
  if (normalize == 1.5) {
    result = arr[0];
    if (arr[1] !== 0) {
      return result + '.' + arr[1];
    }
    return result;
  }
  result = [];
  for (var i = 0; i < normalize; i++) {
    result.push(arr[i]);
  }
  return result.join('.');
}

fetchVersions();
