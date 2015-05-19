var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var self = require("sdk/self");

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

tabs.on('open', countOpenTabs);
tabs.on('close', countOpenTabs);

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
function handleClick(state) {
  tabs.open("./package.json");
}

