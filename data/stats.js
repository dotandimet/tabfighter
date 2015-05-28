  console.log("Hello from content script");
  window.addEventListener('click', function(event) {
    self.port.emit('getstats', 1);
    event.stopPropogation();
    event.preventDefault();
  }, false);

  self.port.on('stats', function(out) {
    document.getElementById('display').innerHTML = out;
  });
/*      function showTabStats() {
var stats = [
      { id: 'bob', title: 'a dude', url: 'http://corky.net' }
    ];
    var out = '<table>';
    for (stat of stats) {
      out += `<td>${stat.id}</td><td>${stat.title}</td><td>${stat.url}</td>`;
    }
    out += '</table>'; 
  }*/

