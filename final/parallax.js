// On scroll, parallax
// Moves the white of the page up slowly over the banner slower than the page is moving
var bannerPosition = d3.scaleLinear()
.domain([0, window.innerHeight/2])
.range([100, 0]);

d3.select(window)
.on("scroll", function() {
    
    var y = bannerPosition(window.scrollY);
    d3.select("#banner")
    .style("background-position", "50% " + y + "%");

});