
  self.port.on('stats', function(stats) {
    console.log(stats);
    console.log(JSON.stringify(stats));
    var out = '<table>';
    var k = Object.keys(stats.all);
    Array.forEach(k, function(i) {
      let stat = stats.all[i];
      out += `<tr><td>${stat.id}</td><td>${stat.title}</td><td>${stat.url}</td></tr>`;
    });
    out += '</table>'; 
    document.getElementById('display').innerHTML = out;
  });

