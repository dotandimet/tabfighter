
  self.port.on('stats', function(obj) {
    console.log(obj);
    document.querySelector('h2').innerHTML = `Since we started, you opened ${obj.opened.length} tabs and closed ${obj.closed.length} tabs`
                                           + `<br>we have ${obj.stats.length} tabs`;
    var out = '<table><tr><th>Id</th><th>Page</th><th>Pages</th><th>Age</th><th>Love</th></tr>';
    obj.stats.map(function(stat) {
      out += `<tr><td>${stat.id}</td><td><a href="${stat.url}" data-tab-id="${stat.id}">${stat.title}</a></td><td>${stat.navCount}</td><td>${stat.AGE}</td><td>${stat.LOVE}</tr>`;
    });
    out += '</table>'; 
    document.getElementById('display').innerHTML = out;
  });

 window.addEventListener('click', function(ev) {
    ev.preventDefault();
    self.port.emit('picktab', ev.target.getAttribute('data-tab-id'));
 }, false);
