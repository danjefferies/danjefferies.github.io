// PARALLAX ON SCROLL
var bannerPosition = d3.scaleLinear()
.domain([0, window.innerHeight/2])
.range([100, 0]);

d3.select(window)
.on("scroll", function() {
    
    var y = bannerPosition(window.scrollY);
    d3.select("#banner")
    .style("background-position", "50% " + y + "%");

});


// IMAGE SLIDESHOW
var indexValue = 0;
  
function slideShow(){
  var x;
  const img = document.querySelectorAll("img.slide");
  for(x = 0; x < img.length; x++){
    img[x].style.display = "none";
  }
  indexValue++;
  if(indexValue > img.length){indexValue = 1}
  img[indexValue -1].style.display = "block";
}
slideShow();

window.onload = function(){
  setInterval(function(){slideShow();}, 4000);
}

// VISUALIZATION
// Variable Declarations
const width = document.querySelector("#here").clientWidth;
const height = document.querySelector("#here").clientHeight;
const margin = { top: 25, right: 25, bottom: 75, left: 50 };


// Create SVG canvas
var svg = d3
    .select("#here")
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height);

// initialize the x axis
const x = d3.scaleLinear()
    .range([margin.left, width]);
const xAxis = svg.append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`);


// initialize the y axis
const y = d3.scaleLinear()
    .range([ height - margin.bottom, height - margin.bottom - 20 * 20]);
const yAxis = svg.append("g")
    .attr("transform", `translate(${margin.left}, 0)`);

// Load Data
d3.csv("kyderby.csv")
.then(function(derby){

     // Format Data
    derby.forEach(function(d){
        d.year = parseFloat(d.year);
        d.distance_mi = parseFloat(d.distance_mi);
        d.jockey_wins = parseFloat(d.jockey_wins);
        d.trainer_wins = parseFloat(d.trainer_wins);
        d.superfecta_payout = parseFloat(d.superfecta_payout).toFixed(2);
        d.odds = parseFloat(d.odds);
        d.starts = parseFloat(d.starts);
        d.wps = parseFloat(d.wps);
        d.wps_ratio = parseFloat(d.wps_ratio).toFixed(3);
    });

    // Function to Filter Data based on "era"
    const filterData = (era) => {
        return derby.filter(function (d) {
            return d.era === `${era}`;
        });
    };

    // Draw initial chart using "era1"
    updateChart(filterData("era1"));

    // change eras on button click
    d3.select("#era1").on("click", function(d){

        const currentEra = this.id;
        updateChart(filterData(currentEra));

    });

    // change eras on button click
    d3.select("#era2").on("click", function(d){

        const currentEra = this.id;
        updateChart(filterData(currentEra));

    });

    // change eras on button click
    d3.select("#era3").on("click", function(d){

        const currentEra = this.id;
        updateChart(filterData(currentEra));

    });

    // draw axis labels
   const xAxisLabel = svg
   .append("text")
   .attr("class", "axisLabel")
   .attr("x", width / 2)
   .attr("y", height - margin.bottom / 2.5)
   .attr("text-anchor", "middle")
   .text("Number of career starts per racehorse");

   const yAxisLabel = svg
   .append("text")
   .attr("class", "axisLabel")
   .attr("x", -height / 2.5)
   .attr("y", margin.left / 4)
   .attr("transform", "rotate(-90)")
   .attr("text-anchor", "middle")
   .text("Ratio of times placed 1st-3rd (WPS)");

});


// Function that is provided data based on era, and draws entire chart including axes
function updateChart(chartData){
    var startMin = d3.min(chartData, function(d){
        return d.starts - 5;
    });

    var startMax = d3.max(chartData, function(d){
        return d.starts;
    });

    var ratioMin = d3.min(chartData, function(d){
        return d.wps_ratio - 0.1;
    });

    var ratioMax = d3.max(chartData, function(d){
        return d.wps_ratio;
    });

// Bind Data
var circles = svg.selectAll("circle")
    .data(chartData);

// Update the X axis
x.domain([startMin, startMax])
xAxis.call(d3.axisBottom(x));

// Update the Y axis
y.domain([ratioMin, ratioMax])
yAxis.transition().duration(1000).call(d3.axisLeft(y));

// Color scale
const colorScale = d3.scaleSequential()
    .interpolator(d3.interpolateRgb("#DC0635", "#F3AD3D"))
    .domain([6, 0]);

// Enter and Update
circles
   .enter()
   .append("circle")
   .merge(circles)
   .transition().duration(2000)
       .attr("cx", function(d){ return x(d.starts); })
       .attr("cy", function(d){ return y(d.wps_ratio); })
       .attr("r", 8)
       .attr("fill-opacity", 0.95)
       .attr("fill", function(d){
           return colorScale(d.trainer_wins)
       })
       .attr("stroke", "black")
       .attr("stroke-width", function(d){
        if (d.triple_crown === "T") {
            return 3;
        } else {
            return 1;
        }
    })

// Exit
circles
    .exit()
    .transition().duration(1000)
    .attr("r", 0)
    .remove()

// TOOLTIP
const tooltip = d3
.select("#here")
.append("div")
.attr("class", "tooltip");

circles
.on("mouseover", function(e, d){
    let cx = +d3.select(this).attr("cx");
    let cy = +d3.select(this).attr("cy");
    tooltip
        .style("visibility", "visible")
        .style("left", `${cx}px`)
        .style("top", `${cy}px`)
        .html(`Year: <b>${d.year}</b> <br>
                Horse: <b>${d.winner}</b> <br>
                Trainer: <b>${d.trainer}</b> <br>
                Trainer wins: <b>${d.trainer_wins}</b> <br>
                Odds: <b>${d.odds_high}/${d.odds_low}</b> <br>
                WPS: <b>${d.wps_ratio}</b><br>
                Superfecta: <b>$${d.superfecta_payout}</b>`);
    d3.select(this).attr("stroke", "#DCE4FC").attr("stroke-width", 2);
})
.on("mouseout", function(e, d){
    tooltip.style("visibility", "hidden");
    d3.select(this)
    .attr("fill-opacity", 0.95)
    .attr("fill", function(d){
        return colorScale(d.trainer_wins)
    })
    .attr("stroke", "black")
    .attr("stroke-width", function(d){
     if (d.triple_crown === "T") {
         return 3;
     } else {
         return 1;
     }
        });
    });

};


