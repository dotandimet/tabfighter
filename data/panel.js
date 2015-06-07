function chartStats(data) {
// clear first:
var width = 320,
    barHeight = 20;
var Mx = 3 * d3.max(data, function(d){ return d.size });
var x = d3.scale.linear()
    .domain([0, Mx])
    .range([0, width]);
var chart = d3.select("#chart")
  //  .remove()
    .attr("width", width + 15)
    .attr("height", barHeight * data.length);

var bar = chart.selectAll("g")
 //   .remove()
    .data(data)
  .enter().append("g")
    .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

bar.append("rect")
    .attr("width", function(d) { return x(d.size) })
    .attr("height", barHeight - 1)
    .attr('class', function(d){ return d.type });

bar.append("text")
    .attr("x", function(d) { return x(d.size) +10; })
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .text(function(d) { return `${d.size} ${d.type}`; });

//  console.log(document.getElementById('chart').innerHTML);
};
