
self.port.on('stats', function(obj) {
    document.querySelector('h2').innerHTML =
            `We have ${obj.stats.length} tabs open; ${obj.opened.length} tabs since we started, and ${obj.closed.length} tabs closed`;
    let chartData = [ { type: 'total', size: obj.stats.length },
                      { type: 'opened', size: obj.opened.length },
                      { type: 'closed', size: obj.closed.length } ];
    chartStats(chartData);
  });

 window.addEventListener('click', function(ev) {
    ev.preventDefault();
    if (ev.target.getAttribute('class').match('total')) {
      self.port.emit('listTabs');
    }
 }, false);

 window.addEventListener('keyup', function(ev) {
    if (ev.defaultPrevented) {
      return;
    }
    if (ev.key === '/') {
      self.port.emit('listTabs');
    }
    console.log(ev.key);
    ev.preventDefault();
 }, false);
