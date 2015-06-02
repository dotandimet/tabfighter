var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var self = require("sdk/self");
var windows = require("sdk/windows").browserWindows;
var tabs = require("sdk/tabs");
var moment = require("moment");

var button = ToggleButton({
  id: "tabfighter-button",
  label: "Fight Tab Addiction!",
  icon: {
    "16": "./tabfighter2-16.png",
    "32": "./tabfighter2-32.png",
    "64": "./tabfighter2-64.png"
  },
  badge: 0,
  onClick: handleChange
});

function countOpenTabs(){
  button.badge = tabs.length;
}

var tabStats = {
 opened: 0,
 closed: 0,
 oldest: null,
 newest: null,
 lastClosed : null,
 all : {}
};

function getStatForTab(id) {
  if (!tabStats.all[id]) {
    // create new:
    tabStats.all[id] = { "id": id, "navCount": 0, 'birth': moment(), 'love': 0, 'lastActive': null };
  }
  return tabStats.all[id];
}


function tabDrop(tab) {
  delete tabStats.all[tab.id];
  tabStats.closed += 1;
}

function tabReady(tab) {
    let stat = getStatForTab(tab.id);
    if (stat.url && tab.url !== stat.url) {
        stat.navCount++;
    }
    stat.url = tab.url;
    stat.title = tab.title;
}

function tabActive(tab) {
    let stat = getStatForTab(tab.id);
    stat.lastActive = moment();
}

function tabInactive(tab) {
    let stat = getStatForTab(tab.id);
    let focusTime = stat.lastActive;
    stat.lastActive = moment();
    let love = stat.lastActive - focusTime;
    stat.love += love;
}

tabs.on('activate', tabActive);
tabs.on('deactivate', tabInactive);

tabs.on('open', function(tab){
  tabStats.opened += 1;
  countOpenTabs();
})
tabs.on('ready', tabReady);

tabs.on('close', function(tab) {
  tabDrop(tab);
  countOpenTabs();
});


windows.on('open', function(win) { surveyOpenTabs(win.tabs); });
windows.on('close', function(win) { surveyOpenTabs(win.tabs); });


function surveyOpenTabs(tabCollection) {
  for (let tab of tabCollection) {
    let stat = getStatForTab(tab.id);
    tabReady(tab);
  }
  countOpenTabs();
}

surveyOpenTabs(tabs);

var panel = panels.Panel({
contentURL: self.data.url("panel.html"),
contentScriptFile: self.data.url("stats.js"),
onHide: handleHide
});

panel.on('show', function() {
  tabInactive(tabs.activeTab); // increment love
  let stats = Object.keys(tabStats.all).map(function(k) { return tabStats.all[k]; });
  
  stats.map(function(i) { i.AGE = moment.duration(i.birth - moment()).humanize(true); i.LOVE = (i.love > 0) ? moment.duration(i.love).humanize() : 'none'; });
  panel.port.emit('stats', { "opened": tabStats.opened, "closed": tabStats.closed, "stats": stats } );
});

panel.port.on('picktab', function(id) { for (t of tabs) { if (t.id === id) { t.activate(); } } });

function handleChange(state) {
  if (state.checked) {
    panel.show({
    position: button
  });
}
}

function handleHide() {
  button.state('window', {checked: false});
}


