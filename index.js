var jsdom = require("jsdom");
var localStorage, jsdomGlobal;
try {
  localStorage = require("dom-storage");
} catch(e) {};
try {
  jsdomGlobal = require("jsdom-global");
} catch(e) {};

var jsdomBrowser = function (baseBrowserDecorator) {
  baseBrowserDecorator(this);

  this.name = "jsdom";

  this._start = function (url) {
    jsdom.env({
      url: url,
      features : {
        FetchExternalResources: ["script", "iframe"],
        ProcessExternalResources: ["script"]
      },
      created: function (error, window) {
        if (localStorage) {
          window.localStorage = localStorage;
        }
      },
      onload(window) {
        global.window = window;
        if (jsdomGlobal) {
          jsdomGlobal();
        }
        jsdomGlobal();
        propagateToGlobal(window);
      }
    });
  };
};

function propagateToGlobal (window) {
  for (var key in window) {
    if (!window.hasOwnProperty(key)) continue;
    if (key in global) continue;

    global[key] = window[key];
  };
};

jsdomBrowser.$inject = ["baseBrowserDecorator"];

module.exports = {
  "launcher:jsdom": ["type", jsdomBrowser]
};
