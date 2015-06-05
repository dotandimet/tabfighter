
  self.port.on('stats', function(obj) {
    console.log(obj);
    document.querySelector('h2').innerHTML = `Since we started, you opened ${obj.opened.length} tabs and closed ${obj.closed.length} tabs`
                                           + `<br>we have ${obj.stats.length} tabs`;
  });

 window.addEventListener('click', function(ev) {
    ev.preventDefault();
    self.port.emit('listTabs', ev.target.getAttribute('data-tab-id'));
 }, false);
