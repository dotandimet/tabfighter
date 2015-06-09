function chartStats(data) {
var colors = {
  total: '#0000FF',
  opened: '#FF0000',
  closed: '#00FF00'
};
var width = 320,
    barHeight = 20;
var Mx = 3 * d3.max(data, function(d){ return d.size });
var x = d3.scale.linear()
    .domain([0, Mx])
    .range([0, width]);
    d3.select("#chart")
      .selectAll('svg').remove();
    
    var chart = d3.select("#chart").append('svg')
    .attr("width", width + 15)
    .attr("height", barHeight * data.length);

var bar = d3.select('svg').selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

    bar.append("rect")
    .attr("width", function(d) { return x(d.size) })
    .attr("height", barHeight - 1)
    .attr('class', function(d){ return d.type })
    .style('fill', function(d){ return colors[d.type] })
    .on('mouseover', function(d){ d3.select(this).style('fill', '#4c5cfc') })
    .on('mouseout', function(d){ d3.select(this).style('fill', colors[d.type]); });

bar.append("text")
    .attr("x", function(d) { return x(d.size) +10; })
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .text(function(d) { return `${d.size} ${d.type}`; });

//  console.log(document.getElementById('chart').innerHTML);
};
