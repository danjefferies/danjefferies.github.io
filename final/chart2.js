// Highlight contents on mousemove

d3.select("#chart2")
.on("mousemove", function(event) {

  var tooltip = d3.select("#tooltip")
    .style("display", "block")
    .style("left", event.pageX + 20 + "px")
    .style("top", event.pageY + 20 + "px");

    tooltip.select("#year").html("2002");

    tooltip.select("#winner").html("War Emblem");

    tooltip.select("#trainer").html("Bob Baffert");

    tooltip.select("#wps_ratio").html("0.54");

    tooltip.select("#payout").html("91,764.50");

})
.on("mouseout", function() {

  d3.select("#tooltip")
    .style("display", "none");

});


