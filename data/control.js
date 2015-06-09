function ago(time) {
    return moment(new Date(time)).fromNow();
}

function duration(time) {
    return (time > 0) ? moment.duration(time).humanize()
                      : 'none';
}

self.port.on('stats', function(obj) {
    document.querySelector('h2').innerHTML =
            `We have ${obj.stats.length} tabs open; ${obj.opened.length} tabs since we started, and ${obj.closed.length} tabs closed`;
    let chartData = [ { type: 'total', size: obj.stats.length },
                      { type: 'opened', size: obj.opened.length },
                      { type: 'closed', size: obj.closed.length } ];
    chartStats(chartData);
    let last_opened = ( obj.opened.length > 0 )
                    ? obj.opened[obj.opened.length-1]
                    : false;
    let last_closed = ( obj.closed.length > 0 )
                    ? obj.closed[obj.closed.length-1]
                    : false;
    let out = [];
    if (last_opened) {
      console.log('Last opened: ' + last_opened);
      out.push(`Last tab opened ${ago(last_opened)}`);
    }
    if (last_closed) {
      console.log('Last closed: ' + last_closed);
      out.push(`Last tab closed ${ago(last_closed[0])}`);
      out.push(`It was ${duration(last_closed[0] - last_closed[1])} old`);
    }
    document.getElementById('activity').innerHTML = out.join('<br>');
  });

 window.addEventListener('click', function(ev) {
    ev.preventDefault();
    if (ev.target.getAttribute('class').indexOf('total') != -1) {
      self.port.emit('listTabs');
    }
 }, false);


