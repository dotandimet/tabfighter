
  self.port.on('stats', function(obj) {
    console.log(obj);
    document.querySelector('h2').innerHTML = `Since we started, you opened ${obj.opened} tabs and closed ${obj.closed} tabs`;
    var out = '<table><tr><th>Id</th><th>Page</th><th>Pages</th><th>Age</th><th>Love</th></tr>';
    obj.stats.map(function(stat) {
      out += `<tr><td>${stat.id}</td><td><a href="${stat.url}">${stat.title}</a></td><td>${stat.navCount}</td><td>${stat.age}</td><td>${stat.attention}</tr>`;
    });
    out += '</table>'; 
    document.getElementById('display').innerHTML = out;
  });

 window.addEventListener('click', function(ev) {
    ev.preventDefault();
    self.port.emit('picktab');
 }, false);
