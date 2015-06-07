
function showTable(stats) {
    var out = '<table><tr><th>Id</th><th>Page</th><th>Pages</th><th>Age</th><th>Love</th></tr>';
    stats.map(function(stat) {
      out += `<tr><td>${stat.id}</td><td><a href="${stat.url}" data-tab-id="${stat.id}">${stat.title}</a></td><td>${stat.navCount}</td><td>${stat.AGE}</td><td>${stat.LOVE}</tr>`;
    });
    out += '</table>';
    document.getElementById('display').innerHTML = out;

}
  self.port.on('stats', function(obj) {
    window.obj = obj;
    showTable(obj.stats);
    document.getElementById('search').focus();
  });

 window.addEventListener('click', function(ev) {
    ev.preventDefault();
    self.port.emit('picktab', ev.target.getAttribute('data-tab-id'));
 }, false);

document.getElementById('search').addEventListener('keyup', function(ev) {
  ev.preventDefault();
  let search = ev.target.value;
  let re = new RegExp(search, 'i');
  console.log(search);
  console.log(obj);
  let stats = obj.stats;
  if (search.length > 0) {
    stats = obj.stats.filter(
        function(stat) {
          console.log(stat.title);
          return (  stat.title.match(re) !== null
                 || stat.url.match(re) !== null
                 ) ? true
                   : false;
        });
  }
  showTable(stats);
}, false);
