var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var self = require("sdk/self");
var windows = require("sdk/windows").browserWindows;
var tabs = require("sdk/tabs");

var button = ToggleButton({
  id: "tabfighter-button",
  label: "Fight Tab Addiction!",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  badge: 0,
  onClick: handleChange
});

function countOpenTabs(){
  button.badge = tabs.length;
}

var tabStats = {
  count: 0,
  oldest: null,
  newest: null,
  lastClosed : null,
  all : {}
};



function gatherStats() {
  for (let tab of tabs) {
    tabStats.all[tab.id] = { id: tab.id };
    if (tab.readyState === 'interactive' || tab.readyState === 'complete') {
      tabStats.all[tab.id].url = tab.url;
      tabStats.all[tab.id].title = tab.url;
    }
  }
}

tabs.on('open', countOpenTabs);
tabs.on('close', countOpenTabs);
windows.on('open', countOpenTabs);
windows.on('close', countOpenTabs);
countOpenTabs();

var panel = panels.Panel({
contentURL: self.data.url("panel.html"),
onHide: handleHide
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
