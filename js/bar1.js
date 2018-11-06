// Define SVG area dimensions
var svg_Width = 960;
var svg_Height = 660;

// Define the chart's margins as an object
var chart_Margin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 100
};

// Define dimensions of the chart area
var chart_Width = svg_Width - chart_Margin.left - chart_Margin.right;
var chart_Height = svg_Height - chart_Margin.top - chart_Margin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#chart2")
  .append("svg")
  .attr("height", svg_Height)
  .attr("width", svg_Width);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chart_Group = svg.append("g")
  .attr("transform", `translate(${chart_Margin.left}, ${chart_Margin.top})`);

// Load video game sales data
d3.csv("../db/ratingcount.csv", function(error, sales_Data) {
  if (error) throw error;

  console.log(sales_Data);

  // Cast the NA_sales value to a number for each piece of sales data
  sales_Data.forEach(function(d) {
    d.count = +d.count;
  });

  // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
  var xBand_Scale = d3.scaleBand()
    .domain(sales_Data.map(d => d.Rating))
    .range([0, chart_Width])
    .padding(0.1);

  // Create a linear scale for the vertical axis.
  var yLinear_Scale = d3.scaleLinear()
    .domain([0, d3.max(sales_Data, d => d.count)])
    .range([chart_Height, 0]);

  // Create two new functions passing our scales in as arguments
  // These will be used to create the chart's axes
  var bottom_Axis = d3.axisBottom(xBand_Scale);
  var left_Axis = d3.axisLeft(yLinear_Scale).ticks(10);

  // Append two SVG group elements to the chartGroup area,
  // and create the bottom and left axes inside of them
  chart_Group.append("g")
    .call(left_Axis);

  chart_Group.append("g")
    .attr("transform", `translate(0, ${chart_Height})`)
    .call(bottom_Axis);

  // Create one SVG rectangle per piece of tvData
  // Use the linear and band scales to position each rectangle within the chart
  chart_Group.selectAll(".bar")
    .data(sales_Data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => xBand_Scale(d.Rating))
    .attr("y", d => yLinear_Scale(d.count))
    .attr("width", xBand_Scale.bandwidth())
    .attr("height", d => chart_Height - yLinear_Scale(d.count));

  // Create axes labels
  chart_Group.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - chart_Margin.left +30)
    .attr("x", 0 - (chart_Height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Game Count");

});
