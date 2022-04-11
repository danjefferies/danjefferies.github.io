// Data viz

d3.csv("kyderby.csv")
.then(function(derby){
    derby.forEach(function(d){
        d.year = parseFloat(d.year);
        d.distance_mi = parseFloat(d.distance_mi);
        d.jockey_wins = parseFloat(d.jockey_wins);
        d.trainer_wins = parseFloat(d.triner_wins);
        d.superfecta_payout = parseFloat(d.superfecta_payout);
        d.odds = parseFloat(d.odds);
        d.starts = parseFloat(d.starts);
        d.wps = parseFloat(d.wps);
        d.wps_ratio = parseFloat(d.wps_ratio);
    });

    // group the data by eras
    var groupedEra = d3.group(derby, function(d){
        return d.era;
    });


const width = document.querySelector("#here").clientWidth;
const height = document.querySelector("#here").clientHeight;
const margin = { top: 25, right: 25, bottom: 75, left: 75 };

// create SVG canvas
const svg = d3
    .select("#here")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


    // filter data
const filterData = (era) => {
    return derby.filter(function (d) {
      return d.era === `${era}`;
        });
    
    };
    
    const data_era1 = filterData("era1");
    const data_era2 = filterData("era2");
    const data_era3 = filterData("era3");
    
    // determine the min and max to create scales with
    const wpsDomain = {
        min1: d3.min(data_era1, function(d){
            return +d.wps_ratio;
        }),
        max1: d3.max(data_era1, function(d){
            return +d.wps_ratio;
        }),
        min2: d3.min(data_era2, function(d){
            return +d.wps_ratio;
        }),
        max2: d3.max(data_era2, function(d){
            return +d.wps_ratio;
        }),
        min3: d3.min(data_era3, function(d){
            return +d.wps_ratio;
        }),
        max3: d3.max(data_era3, function(d){
            return +d.wps_ratio;
        })
    }

// create scales
const xScale = d3
    .scaleLinear()
    // .domain([wpsDomain.min1 - 0.3, wpsDomain.max1 + 0.05])
    .domain([0, 120])
    .range([margin.left, width - margin.right]);

const yScale = d3
    .scaleLinear()
    .domain([0.1, 1])
    .range([height - margin.bottom, 
        height - margin.bottom - 20 * 20]);

const colorScale = d3
    .scaleSequential()
    .domain([0.01, 100])
    .interpolator(d3.interpolateRgb);
    
// draw axes
const xAxis = svg
    .append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom().scale(xScale));

const yAxis = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft().scale(yScale));

// draw points (default is using era1)
const circles = svg
    .selectAll("circle")
    .data(data_era1)
    .enter()
    .append("circle")
    .attr("cx", function(d){
        return xScale(d.starts);
    })
    .attr("cy", function(d){
        return yScale(d.wps_ratio);
    })
    .attr("r", 8)
    //// FILL TO FIT ODDS, DEEPER COLOR IF LONGSHOT??
    // .attr("fill", function(d){
    //     if (d.odds < 10) {
    //         return "black";
    //     } else {
    //         return "white"
    //     }
    // })
    .attr("fill", function(d){
        return colorScale(d.odds);
    })
    .attr("fill-opacity", 0.6)
    .attr("stroke", function(d){
        if (d.triple_crown === "T") {
            return "#DC0635";
        } else {
            return ("stroke-width", 0)
        }
    })
    .attr("stroke-width", 3);

 // draw axis labels
	const xAxisLabel = svg
    .append("text")
    .attr("class", "axisLabel")
    .attr("x", width / 2)
    .attr("y", height - margin.bottom / 2 + 10)
    .attr("text-anchor", "middle")
    .text("Number of career starts per racehorse");

const yAxisLabel = svg
    .append("text")
    .attr("class", "axisLabel")
    .attr("x", -height / 2)
    .attr("y", margin.left / 2 - 10)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .text("WPS Record: 1st-3rd place");


// update to change eras on button...
d3.select("#era1_button").on("click", function(d){
    xScale.domain([0, 120]);
    yScale.domain([0.1, 1]);

    let c = svg.selectAll("circle").data(data_era1, function(d){
        return d.wps_ratio;
    });

    c.enter()

})


console.log("derby", derby);
console.log("Eras", groupedEra);
console.log("wpsDomain", wpsDomain);

// TOOL TIP
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
                  WPS: <b>${d.wps_ratio}</b>`);
        d3.select(this).attr("stroke", "#BDD180").attr("stroke-width", 3);
    })
    .on("mouseout", function(e, d){
        tooltip.style("visibility", "hidden");
        d3.select(this)
            .attr("stroke-width", 3)
            .attr("stroke", function(d){
                if (d.triple_crown === "T") {
                    return "#DC0635";
                } else {
                    return ("stroke-width", 0);
                }
            })
        });
        
});