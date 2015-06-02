var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var self = require("sdk/self");
var windows = require("sdk/windows").browserWindows;
var tabs = require("sdk/tabs");
var moment = require("moment");
var { setTimeout } = require("sdk/timers");

var button = ToggleButton({
  id: "tabfighter-button",
  label: "Fight Tab Addiction!",
  icon: {
    "16": "./tabfighter2-16.png",
    "32": "./tabfighter2-32.png",
    "64": "./tabfighter2-64.png"
  },
  badge: 0,
  badgeColor: '#0000ff',
  onClick: handleChange
});

function countOpenTabs(){
  button.badge = tabs.length;
}

var tabStats = {
 opened: [],
 closed: [],
 all : {}
};

function oldestTab() {
  for( let t of tabs ) {
    getStatForTab(t.id).birth;
  }
}

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
  tabStats.opened.push( getStatForTab(tab).birth );
  countOpenTabs();
});

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
// run survey on startup:
// maybe timer will make this happen after session restore?
setTimeout( function() {
    surveyOpenTabs(tabs);
    panel = panels.Panel({
      contentURL: self.data.url("panel.html"),
      contentScriptFile: self.data.url("stats.js"),
      onHide: handleHide,
    });
panel.on('show', function() {
  tabInactive(tabs.activeTab); // increment love
  let stats = Object.keys(tabStats.all).map(function(k) { return tabStats.all[k]; });
  
  stats.map(function(i) { i.AGE = moment.duration(i.birth - moment()).humanize(true); i.LOVE = (i.love > 0) ? moment.duration(i.love).humanize() : 'none'; });
  panel.port.emit('stats', { "opened": tabStats.opened, "closed": tabStats.closed, "stats": stats, "overflowed": checkInvisibleTabs() } );
});

panel.port.on('picktab', function(id) { for (let t of tabs) { if (t.id === id) { t.activate(); } } });

    }, 2000);

var panel = null;
function handleChange(state) {
  if (state.checked && panel !== null) {
    panel.show({
    position: button
  });
}
}

function handleHide() {
  button.state('window', {checked: false});
}


//var { modelFor } = require("sdk/model/core");
var { viewFor } = require("sdk/view/core");
var tab_utils = require("sdk/tabs/utils");

function getBrowser(tab) {
  var llt = viewFor(tab);
  var tabBrowser = tab_utils.getTabBrowserForTab(llt);
  return tabBrowser;
}

function checkInvisibleTabs() {
  var browse = getBrowser(tabs.activeTab);
  console.log('browser tabs: ' + browse.tabs.length + ' visible: ' + browse.visibleTabs.length);
  return (browse.tabs.length > browse.visibleTabs.length) ? (browse.tabs.length - browse.visibleTabs.length) : false;
}


