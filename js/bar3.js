// Define SVG area dimensions
var svg__Width = 960;
var svg__Height = 660;

// Define the chart's margins as an object
var chart__Margin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30
};

// Define dimensions of the chart area
var chart__Width = svg__Width - chart__Margin.left - chart__Margin.right;
var chart__Height = svg__Height - chart__Margin.top - chart__Margin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#chart4")
  .append("svg")
  .attr("height", svg__Height)
  .attr("width", svg__Width);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chart__Group = svg.append("g")
  .attr("transform", `translate(${chart__Margin.left}, ${chart__Margin.top})`);

// Load video game sales data
d3.csv("../db/models.csv", function(error, sales__Data) {
  if (error) throw error;

  console.log(sales__Data);

  // Cast the NA_sales value to a number for each piece of sales data
  sales__Data.forEach(function(d) {
    d.Score = +d.Score;
  });

  // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
  var xBand__Scale = d3.scaleBand()
    .domain(sales__Data.map(d => d.Model))
    .range([0, chart__Width])
    .padding(0.1);

  // Create a linear scale for the vertical axis.
  var yLinear__Scale = d3.scaleLinear()
    .domain([0, d3.max(sales__Data, d => d.Score)])
    .range([chart__Height, 0]);

  // Create two new functions passing our scales in as arguments
  // These will be used to create the chart's axes
  var bottom__Axis = d3.axisBottom(xBand__Scale);
  var left__Axis = d3.axisLeft(yLinear__Scale).ticks(10);

  // Append two SVG group elements to the chartGroup area,
  // and create the bottom and left axes inside of them
  chart__Group.append("g")
    .call(left__Axis);

  chart__Group.append("g")
    .attr("transform", `translate(0, ${chart__Height})`)
    .call(bottom__Axis);

  // Create one SVG rectangle per piece of tvData
  // Use the linear and band scales to position each rectangle within the chart
  chart__Group.selectAll(".bar")
    .data(sales__Data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => xBand__Scale(d.Model))
    .attr("y", d => yLinear__Scale(d.Score))
    .attr("width", xBand__Scale.bandwidth())
    .attr("height", d => chart__Height - yLinear__Scale(d.Score));

  // Step 1: Append tooltip div
  var toolTip = d3.select("body")
    .append("div")
    .style("display", "none")
    .classed("tooltip", true);

  // Step 2: Create "mouseover" event listener to display tooltip
  chart__Group.on("mouseover", function(d) {
    toolTip.style("display", "block")
    //   .html(
    //     `<strong>${(d.Genre)}<strong><hr>${d.Critic_Score}
    // Games`)
    .html(
      `
  Games`)
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px");
        // d3.select(this).style("stroke", "#323232");
    })
      // Step 3: Create "mouseout" event listener to hide tooltip
     .on("mouseout", function() {
       toolTip.style("display", "none");
       // d3.select(this).style("stroke", "#e3e3e3");
     });

});
