(function(){
  var width = 800,
    height = 800;

  var svg = d3.select("#chart")
  //   .select(".chart")
//d3.select("#chart")
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .append("g")
    .attr("transform", "translate(0,0)")

    // <defs>
    //   <pattern id="linkpose" height=%100 width="%100" patternContentUnits="objectBoundingBox">
    //     <image height="1" width="1" preserveAspectRatio="none" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="linkpose.jpg">
    //     </image>
    //   </pattern>
    // </defs>

  var defs = svg.append("defs");

  defs.append("pattern")
    .attr("id", "link-pose")
    .attr("height", "100%")
    .attr("width", "100%")
    .attr("patternContenUnits", "objectBoundingBox")
    .append("image")
    .attr("height", "30%")
    .attr("width", "30%")
    .attr("preserveAspectRatio", "none")
    //.attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
    .attr("xlink:href", "../assets/chimmy.gif");

  var radiusScale = d3.scaleSqrt().domain([758, 39303]).range([10, 70])

  //the simulation is a collection of forceSimulation
  //about where we want our circles to go
  //and how we want our circles to interact
  var simulation = d3.forceSimulation()
    //give force a name and define the force
    //strength should be a number between 0-1, play around with it
    .force("x", d3.forceX(width / 2).strength(5))
    .force("y", d3.forceY(height / 2).strength(5))
    //get circles to the middle
    //don't have them collide
    .force("collide", d3.forceCollide(function(d){
      return radiusScale(d.count+50);
    }))

  d3.queue()
    .defer(d3.csv,"../db/genrecountfinal.csv")
    .await(ready)

  function ready (error, datapoints) {


    var circles = svg.selectAll(".genre")
      .data(datapoints)
      .enter().append("circle")
      .attr("class", "genre")
      .attr("r", function(d){
                           //size of cirlces
        return radiusScale(d.count+50);
      })

      .attr("fill", "url(#link-pose)")
      // .attr("fill", "lightblue")
      // .attr("fill", function(d){
      //   return "url(#" + d[0][image_path] + ")"
      // })
      .on('click', function(d) {
        console.log(d)
      })

    // Step 1: Append tooltip div
    var toolTip = d3.select("body")
      .append("div")
      .style("display", "none")
      .classed("tooltip", true);

    // Step 2: Create "mouseover" event listener to display tooltip
    circles.on("mouseover", function(d) {
      toolTip.style("display", "block")
          .html(
            `<strong>${(d.genre)}<strong><hr>${d.count}
        Games`)
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + "px");
          d3.select(this).style("stroke", "#323232");
      })
        // Step 3: Create "mouseout" event listener to hide tooltip
       .on("mouseout", function() {
         toolTip.style("display", "none");
         d3.select(this).style("stroke", "#e3e3e3");
       });


    simulation.nodes(datapoints)
      .on('tick', ticked)

    function ticked() {
      circles
        .attr("cx", function(d) {
          return d.x
        })
        .attr("cy", function(d) {
          return d.y
        })
    }

  }

})();
