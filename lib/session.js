 var {Cc, Ci, Cu} = require("chrome");

 var ss = Cc["@mozilla.org/browser/sessionstore;1"]
                     .getService(Ci.nsISessionStore);

var { viewFor } = require("sdk/view/core");
var { modelFor } = require("sdk/model/core");
var tab_utils = require("sdk/tabs/utils");
var win_utils = require("sdk/window/utils");

var sess = {
  deleteTabValue: function(tab, key) {
    ss.deleteTabValue(viewFor(tab), key);
  },
  deleteWindowValue: function(win, key) {
    ss.deleteWindowValue(viewFor(win), key);
  },
  duplicateTab: function(win, tab) {
    var tt = ss.duplicateTab(viewFor(win), viewFor(tab));
    return modelFor(tt);
  },
  forgetClosedTab: function(win, index) {
    var tt = ss.forgetClosedTab(viewFor(win), index);
    return modelFor(tt);
  },
  forgetClosedWindow: function(index) {
    return ss.forgetClosedWindow(index);
  },
  getBrowserState: function() {
    return ss.getBrowserState();
  },
  getClosedTabCount: function(win) {
    return ss.getClosedTabCount(viewFor(win));
  },
  getClosedTabData: function(win) {
    return ss.getClosedTabData(viewFor(win));
  },
  getClosedWindowCount: function() {
    return getClosedWindowCount();
  },
  getClosedWindowData: function() {
    return ss.getClosedWindowData();
  },
  getTabState: function(tab) {
    return ss.getTabState(viewFor(tab));
  },
  getTabValue: function(tab, key) {
    return ss.getTabValue(viewFor(tab), key);
  },
  getWindowState: function(win) {
    return ss.getWindowState(viewFor(win));
  },
  getWindowValue: function(win, key) {
    return ss.getWindowValue(viewFor(win), key);
  },
  persistTabAttribute: function(name) {
    return ss.persistTabAttribute(name);
  },
  restoreLastSession: function() {
    return ss.restoreLastSession();
  },
  setBrowserState: function(state) {
    return ss.setBrowserState(state);
  },
  setTabState: function(tab, state) {
    return ss.setTabState(viewFor(tab), state);
  },
  setTabValue: function(tab, key, value) {
    return ss.setTabValue(viewFor(tab), key, value);
  },
  setWindowState: function(win, state, overwrite) {
    return ss.setWindowState(viewFor(win), state, overwrite);
  },
  setWindowValue: function(win, key, value) {
    return ss.setWindowValue(viewFor(win), key, value);
  },
  undoCloseTab: function(win, index) {
    return ss.undoCloseTab(viewFor(win), index);
  },
  undoCloseWindow: function(index) {
    var win = ss.undoCloseWindow(index);
    return modelFor(win);
  },
  getBrowserStateObject: function() {
    return JSON.parse(this.getBrowserState());
  }
};

exports.sessionStore = sess;
// var { viewFor } = require("sdk/view/core");
// var tab_utils = require("sdk/tabs/utils");
// 
// function tabContainer(window) {
//   var llw = viewFor(window);
//   return tab_utils.getTabContainer(llw);
// }
// 
// 
// function myExtensionHandleRestore(callback) {
//   return function(aEvent) {
//    var tab = event.originalTarget;        /* the tab being restored */
//    var uri = tab.linkedBrowser.contentDocument.location;  /* the tab's URI */
//   callback('Tab is: ' + tab + ' uri is ' + uri);
//   };
// }
// 
// exports.tabRestoring = function(window, callback) {
// tabContainer(window).addEventListener("SSTabRestoring", myExtensionHandleRestore(callback), false);
// };
