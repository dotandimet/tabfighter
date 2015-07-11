function ago(time) {
    return moment(new Date(time)).fromNow();
}

function duration(time) {
    return (time > 0) ? moment.duration(time).humanize()
                      : 'none';
}


function showTable(stats) {
    var out = '<table><tr><th>Id</th><th>Page</th><th>Pages</th><th>Age</th><th>Love</th></tr>';
    stats.map(function(stat) {
      out += `<tr><td>${stat.id}</td><td><a href="${stat.url}" data-tab-id="${stat.id}">${stat.title}</a></td><td>${stat.navCount}</td><td>${ago(stat.birth)}</td><td>${duration(stat.love)}</tr>`;
    });
    out += '</table>';
    document.getElementById('display').innerHTML = out;

}

function textFilter(stats, search) {
  if (search.length > 0) {
    let re = new RegExp(search, 'i');
    stats = stats.filter(
        function(stat) {
          console.log(stat.title);
          return (  stat.title.match(re) !== null
                 || stat.url.match(re) !== null
                 ) ? true
                   : false;
        });
  }
  return stats;
}

function tableSort(stats, field, dir) {
  var numCmp = function(a, b) { return a[field] - b[field] };
  var revNumCmp = function(a, b) { return b[field] - a[field] };
  var cmpFunc = ( field === 'age' || field === 'love' )
              ? ( dir && dir === -1) ? revNumCmp
              : numCmp               : false
              ;
  if (cmpFunc) {
     return stats.sort(cmpFunc);
  }
  else {
     if (dir && dir === -1) {
        return stats.sort().reverse();
     }
     else
       return stats.sort();
  }
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
  showTable(textFilter(obj.stats, search));
}, false);

document.querySelector('form').addEventListener('submit', function(ev) {
  ev.preventDefault();
  return false;
}, false);
