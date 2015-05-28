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
  count: 0,
  oldest: null,
  newest: null,
  lastClosed : null,
  all : {}
};

function getStatForTab(id) {
  if (!tabStats.all[id])
    tabStats.all[id] = { "id": id };
  return tabStats.all[id];
}

function tabAdd(tab) {
  let stat = getStatForTab(tab.id);
  stat.birth = Date.now();
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
    stat.title = tab.url;
}

tabs.on('open', function(tab){
  tabAdd(tab);
  countOpenTabs();
  tab.on('ready', tabReady)
});

tabs.on('close', function(tab) {
  tabDrop(tab);
  countOpenTabs();
});

windows.on('open', countOpenTabs);
windows.on('close', countOpenTabs);

countOpenTabs();

var panel = panels.Panel({
contentURL: self.data.url("panel.html"),
contentScriptFile: self.data.url("stats.js"),
onHide: handleHide
});

panel.port.on('getstats', function(x) {
  let payload = JSON.stringify(tabStats);
  console.log(`sending payload: ${payload}`);
  panel.port.emit('stats', payload);
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
