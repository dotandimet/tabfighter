var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var self = require("sdk/self");
var windows = require("sdk/windows").browserWindows;
var tabs = require("sdk/tabs");

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
  button.badge = tabStats.count = tabs.length;
}

var tabStats = {
  count: function() {
    return Object.keys(tabStats.all).length;
   },
  oldest: function() {
    var oldest_idx;
    for (let idx in tabStat.all) {
       
    return Object.values(tabStats.all).reduce(
      function(prev, curr, i, ar) {
        if (curr.birth < prev.birth) {
         return curr;
        }
        else {
         return prev;
        }
  newest: null,
  lastClosed : null,
  all : {}
};

function getStatForTab(id) {
  if (!tabStats.all[id]) {
    // create new:
    tabStats.all[id] = { "id": id, "navCount": 0, birth: date.now() };
  }
  return tabStats.all[id];
}


function tabDrop(tab) {
  delete tabStats.all[tab.id];
}

function tabAge(id) {
  let stat = getStatForTab(id);
  return Date.now() - stat.birth;
}

function tabReady(tab) {
    let stat = getStatForTab(tab.id);
    if (stat.url && tab.url !== stat.url) {
        stat.navCount++;
    }
    stat.url = tab.url;
    stat.title = tab.title;
}

tabs.on('open', function(tab){
  countOpenTabs();
  tab.on('ready', tabReady)
});

tabs.on('close', function(tab) {
  tabDrop(tab);
  countOpenTabs();
});

windows.on('open', function(win) { surveyOpenTabs(win.tabs); });
windows.on('close', function(win) { surveyOpenTabs(win.tabs); });


function surveyOpenTabs(tabCollection) {
  for (let tab of tabCollection) {
    tabAdd(tab);
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
  panel.port.emit('stats', tabStats);
});

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
