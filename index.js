var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var self = require("sdk/self");
var windows = require("sdk/windows").browserWindows;
var tabs = require("sdk/tabs");
var { setTimeout } = require("sdk/timers");
var { Hotkey } = require("sdk/hotkeys");

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

var tabStats = require('./lib/tabStats').tabStats;
console.log('tabStats is', tabStats);

tabs.on('activate', function(tab){ tabStats.onActive(tab); });
tabs.on('deactivate', function(tab){ tabStats.onInactive(tab); });

tabs.on('open', function(tab){
  tabStats.onOpen(tab);
  countOpenTabs();
});

tabs.on('ready', function(tab){ tabStats.onReady(tab); });

tabs.on('close', function(tab) {
  tabStats.onClose(tab);
  countOpenTabs();
});


windows.on('open', function(win) { surveyOpenTabs(win.tabs); });
windows.on('close', function(win) { surveyOpenTabs(win.tabs); });


function surveyOpenTabs(tabCollection) {
  for (let tab of tabCollection) {
    tabStats.onReady(tab);
  }
  countOpenTabs();
}
// run survey on startup:
// maybe timer will make this happen after session restore?
setTimeout( function() {
    surveyOpenTabs(tabs);
    controlPanel = panels.Panel({
      contentURL: self.data.url("panel.html"),
      contentScriptFile: [
        "./extlib/d3.js",
        "./extlib/moment.js",
        "./panel.js",
        "./control.js"
      ],
      onHide: handleHide,
      contextMenu: true
    });
    controlPanel.port.on('listTabs', showTabList);
    controlPanel.on('show', function() {
      controlPanel.port.emit('stats', tabStats.getStats());
    });
    }, 2000);

var controlPanel = null,
    tabListPanel = null;

function createTabListPanel() {
    tabListPanel = panels.Panel({
      contentURL: self.data.url("tablist.html"),
      contentScriptFile: [
        "./extlib/moment.js",
        "./stats.js",
      ],
      onHide: handleHide,
      width: 600,
      height: 600
    });
tabListPanel.on('show', function() {
  tabStats.onInactive(tabs.activeTab); // increment love
  tabListPanel.port.emit('stats', tabStats.getStats());
});

tabListPanel.port.on('picktab', function(id) {
   for (let t of tabs) {
      if (t.id === id) {
        t.activate();
      }
    }
});

tabListPanel.show();
};

function showTabList() {
  if (tabListPanel === null) {
    createTabListPanel();
  }
  if (tabListPanel.isShowing) {
    tabListPanel.hide();
  }
  else {
    tabListPanel.show();
  }
}

var showHotKey = Hotkey({
  combo: "accel-alt-/",
  onPress: function() {
   showTabList();
  }
});

function handleChange(state) {
  if (state.checked && controlPanel !== null) {
    controlPanel.show({
    position: button
  });
}
}

function handleHide() {
  button.state('window', {checked: false});
}



