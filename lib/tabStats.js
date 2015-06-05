var self = require("sdk/self");
var windows = require("sdk/windows").browserWindows;
var tabs = require("sdk/tabs");
var moment = require("moment");


exports.tabStats = {
  opened: [],
  closed: [],
  all : {},
  getStatForTab: function (id) {
    if (!this.all[id]) {
      // create new:
      this.all[id] = { "id": id, "navCount": 0, 'birth': moment(), 'love': 0, 'lastActive': null };
    }
    return this.all[id];
  },
  onClose: function (tab) {
              this.closed.push( [ moment(), // of death
                  this.getStatForTab(tab.id).birth ]);
              delete this.all[tab.id];
  },
  onOpen: function (tab) {
    this.opened.push( this.getStatForTab(tab.id).birth );
  },
  onReady: function (tab) {
    let stat = this.getStatForTab(tab.id);
    if (stat.url && tab.url !== stat.url) {
        stat.navCount++;
    }
    stat.url = tab.url;
    stat.title = tab.title;
  },
  onActive: function(tab) {
    let stat = this.getStatForTab(tab.id);
    stat.lastActive = moment();
  },
  onInactive: function (tab) {
    let stat = this.getStatForTab(tab.id);
    let focusTime = stat.lastActive;
    stat.lastActive = moment();
    let love = stat.lastActive - focusTime;
    stat.love += love;
  },
  getStats: function() {
    let stats = Object.keys(this.all).map(function(k) { return this.all[k]; }.bind(this));
  stats.map(function(i) { i.AGE = moment.duration(i.birth - moment()).humanize(true); i.LOVE = (i.love > 0) ? moment.duration(i.love).humanize() : 'none'; });
  return { "opened": this.opened, "closed": this.closed, "stats": stats };
}
};

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
