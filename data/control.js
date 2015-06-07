self.port.on('stats', function(obj) {
    document.querySelector('h2').innerHTML =
            `${obj.stats.length} tabs open` +
     `${obj.opened.length} tabs since we started, and ${obj.closed.length} tabs closed`;
  });

 window.addEventListener('click', function(ev) {
    ev.preventDefault();
    self.port.emit('listTabs', ev.target.getAttribute('data-tab-id'));
 }, false);
