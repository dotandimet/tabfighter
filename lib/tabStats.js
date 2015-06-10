var moment = require("moment");
var ss = require("sdk/simple-storage");


var tabStats;
if (!ss.storage.tabStats) {
  ss.storage.tabStats = {
    opened: [],
    closed: [],
    all : {}
  };
}

tabStats = {
  opened: ss.storage.tabStats.opened,
  closed: ss.storage.tabStats.closed,
  all: ss.storage.tabStats.all
};

tabStats.getStatForTab = function (id) {
    if (!this.all[id]) {
      // create new:
      this.all[id] = { "id": id, "navCount": 0, 'birth': Date.now(), 'love': 0, 'lastActive': null };
    }
    return this.all[id];
  };
tabStats.onClose = function (tab) {
              this.closed.push( [ Date.now(), // of death
                  this.getStatForTab(tab.id).birth ]);
              delete this.all[tab.id];
  };
tabStats.onOpen = function (tab) {
    this.opened.push( this.getStatForTab(tab.id).birth );
  }.bind(tabStats);
tabStats.onReady = function (tab) {
    let stat = this.getStatForTab(tab.id);
    if (stat.url && tab.url !== stat.url) {
        stat.navCount++;
    }
    stat.url = tab.url;
    stat.title = tab.title;
  }.bind(tabStats);
tabStats.onActive = function(tab) {
    let stat = this.getStatForTab(tab.id);
    stat.lastActive = Date.now();
  }.bind(tabStats);
tabStats.onInactive = function (tab) {
    let stat = this.getStatForTab(tab.id);
    let focusTime = stat.lastActive;
    stat.lastActive = Date.now();
    let love = stat.lastActive - focusTime;
    stat.love += love;
  }.bind(tabStats);
tabStats.getStats = function() {
    let stats = Object.keys(this.all).map(function(k) { return this.all[k]; }.bind(this));
  return { "opened": this.opened, "closed": this.closed, "stats": stats };
}.bind(tabStats);

exports.tabStats = tabStats;

//var { modelFor } = require("sdk/model/core");
// var { viewFor } = require("sdk/view/core");
// var tab_utils = require("sdk/tabs/utils");
// 
// function getBrowser(tab) {
//   var llt = viewFor(tab);
//   var tabBrowser = tab_utils.getTabBrowserForTab(llt);
//   return tabBrowser;
// }
// 
// 
