//var main = require("../");

var tabStats = require('../lib/tabStats').tabStats;
var tabs = require("sdk/tabs");

exports["test tabStats"] = function(assert) {
  let stat = tabStats.getStatForTab(tabs.activeTab.id);
  assert.ok((stat.id === tabs.activeTab.id), "added a stat for the active tab");
  assert.ok((stat.hasOwnProperty('navCount')), "stat has navCount property");
  let stats = tabStats.getStats();
  assert.deepEqual(stats, { opened: [], closed: [], stats: [ { } ] });
};

// exports["test main async"] = function(assert, done) {
//   assert.pass("async Unit test running!");
//   done();
// };
// 
// exports["test dummy"] = function(assert, done) {
//   main.dummy("foo", function(text) {
//     assert.ok((text === "foo"), "Is the text actually 'foo'");
//     done();
//   });
// };

require("sdk/test").run(exports);
