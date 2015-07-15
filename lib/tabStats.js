var moment = require("moment");
var ss = require("sdk/simple-storage");
var sess = require('./session').sessionStore;


if (ss.storage.tabStats) { // get rid of the old stuff
  delete ss.storage.tabStats;
}

var tabStats = { };
tabStats.getStatForTab = function (id) {
    return sess.getTabState(tab);
};
tabStats.onActive = function(tab) {
    sess.setTabValue(tab, 'TF_lastActive', '' + (0 + Date.now()));
  };
tabStats.onInactive = function (tab) {
    let focusTime = parseInt(sess.getTabValue(tab, 'TF_lastActive'));
    let lastActive = Date.now();
    sess.setTabValue(tab, 'TF_lastActive', '' + (0 + lastActive));
    let love = sess.getTabValue(tab, 'TF_activeTime');
    if (love === '') {
      love = 0;
    }
    else {
      love = parseInt(love);
    }
    love += (lastActive - focusTime);
    sess.setTabValue(tab, 'TF_activeTime', '' + love);
  }.bind(tabStats);

tabStats.getStats = function(tabs) {
    //let obj = sess.getBrowserStateObject();
    let stats = [];
    let opened = [Math.floor(Date.now() - 0.001*Date.now())];
    let closed = [Math.floor(Date.now() - 0.001*Date.now()) ];
    for ( let tab of tabs ) {
      let state = JSON.parse(sess.getTabState(tab));
      let love = 0;
      let ext = state.extData;
      if (ext && ext.TF_activeTime) {
        love = parseInt(ext.TF_activeTime);
      };
      console.log("tab state index: " + state.index);
      console.log("tab state: " + sess.getTabState(tab));
      let c = state.entries[state.index-1];
          stats.push({
            id: tab.id,
            url: c.url,
            title: c.title,
            navCount: state.entries.length,
            birth: state.lastAccessed,
            love: love
          });
   }
   return { stats: stats, opened: opened, closed: closed };
  };

exports.tabStats = tabStats;


