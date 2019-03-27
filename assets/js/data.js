$("#chart-submit").click(function() {
    defineChartData();
});

$('#chart-address-1').keypress(function(e) {
    if (e.keyCode == 13)
        $('#chart-address-2').focus();
});
$('#chart-address-2').keypress(function(e) {
    if (e.keyCode == 13)
        $('#chart-submit').focus();
    defineChartData();
});

var chart;
var colWidth;
var barWidth;
var chartWidth = $("#data-tab--chart").width();
var chartHeight = $("#data-tab--chart").height();
var scale;
var dataset = [0];

chart = d3.select("#data-tab--chart")
    .append("svg")
    .attr("height", chartHeight)
    .attr("width", chartWidth);

function defineChartData() {
    queue()
        .defer(d3.csv, 'assets/data/schoolsshort.csv')
        .await(loadData);
    function loadData(error, schoolData) {
        var ndx = crossfilter(schoolData);
        retrievePostcodeData(ndx);
    }
}

function checkPostcode(selectedPostcode, schoolPostcode) {
        if (schoolPostcode.search(selectedPostcode) != -1 || selectedPostcode=="") {
            return true;
        }    
        else {
            return false;
        }
}

function retrievePostcodeData(schoolData) {
    //   console.log("schoolArray=" + schoolArray);

    //  console.log(ndx);
    var postcodePart1 = $('#chart-address-1').val();
    var postcodePart2 = $('#chart-address-2').val();
    var postcode;
    postcode = postcodePart1 + " " + postcodePart2;
    postcode = postcode.toUpperCase();
    var local_schools_dim;
    local_schools_dim.filterAll();
    local_schools_dim = schoolData.dimension(function(d) {
        if (isNaN(d.NumberOfPupils)) {
            d.NumberOfPupils = 0;
        }
        else {
            d.NumberOfPupils = parseInt(d.NumberOfPupils);
        }
        if (isNaN(d.NumberOfBoys)) {
            d.NumberOfBoys = 0;
        }
        else {
            d.NumberOfBoys = parseInt(d.NumberOfBoys);
        }
        if (isNaN(d.NumberOfGirls)) {
            d.NumberOfGirls = 0;
        }
        else {
            d.NumberOfGirls = parseInt(d.NumberOfGirls);
        }
/*        if (d.Postcode.search(postcode) != -1 || postcode=="") {
            return d.EstablishmentName;
        }
        */
        if(checkPostcode(postcode, d.Postcode)) {
            return d.EstablishmentName;
        }
    });

    //   schoolData.remove();
    //  schoolData.remove(null);

    renderSelector(schoolData,postcode);
    renderPupilsChart(local_schools_dim);
}

function renderSelector(ndx,postcode) {
var postcode_dim=ndx.dimension(function(d) {
    if(d['OfstedRating (name)']=="") {
        d['OfstedRating (name)']="None"
    }
    console.log(d['OfstedRating (name)'])
    if(checkPostcode(postcode,d.Postcode)) {
        return d['OfstedRating (name)'];
    }
})
    var postcodeSelector = postcode_dim.group();
    dc.selectMenu("#data-tab--chart-selector")
        .dimension(postcode_dim)
        .group(postcodeSelector);
}


function renderPupilsChart(schools_dim) {
    //   var schools_dim=schoolData.dimension(dc.pluck('EstablishmentName'));
    //var total_pupils_per_school = schools_dim.group().reduceSum(dc.pluck('NumberOfPupils'));
    var boy_pupils_per_school = schools_dim.group().reduceSum(dc.pluck('NumberOfBoys'));
    var girl_pupils_per_school = schools_dim.group().reduceSum(dc.pluck('NumberOfGirls'));

    var numberOfPupilsChart = dc.barChart('#data-tab--chart');
    numberOfPupilsChart
        .width(chartWidth)
        .height(chartHeight)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(schools_dim)
        //.group(total_pupils_per_school)
            .group(boy_pupils_per_school, "Boys")
                .stack(girl_pupils_per_school, "Girls")
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
         .legend(dc.legend().x(420).y(0).itemHeight(15).gap(5))
        .elasticY(true)
        .xAxisLabel("School")
        .yAxisLabel("Number of Pupils")
        .yAxis().ticks(20);
    dc.renderAll();
}



/*
function renderPupilsChart(school_dim) {
    var total_pupils_per_school = school_dim.group().reduceSum(dc.pluck('NumberOfPupils'));
    var boy_pupils_per_school = school_dim.group().reduceSum(dc.pluck('NumberOfBoys'));
    var girl_pupils_per_school = school_dim.group().reduceSum(dc.pluck('NumberOfGirls'));

    var numberOfPupilsChart = dc.barChart('#data-tab--chart');
    numberOfPupilsChart
        .width(chartWidth)
        .height(chartHeight)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(school_dim)
       // .group(total_pupils_per_school)
         .group(boy_pupils_per_school, "Boys")
            .stack(girl_pupils_per_school, "Girls")
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .legend(dc.legend().x(420).y(0).itemHeight(15).gap(5))
        .elasticY(true)
        .xAxisLabel("School")
        .yAxisLabel("Number of Pupils")
        .yAxis().ticks(20);
    dc.renderAll();
}
*/
/*
function updateChart(dataset) {
    console.log("update chart")
    console.log(chart)

    var bars = chart.selectAll("rect").data(dataset);
    var labels = chart.selectAll("text").data(dataset);

    bars.exit().remove();
    labels.exit().remove();

    drawBars(bars);
    drawLabels(labels);

    sizeBars(bars, dataset);
    positionLabels(labels, dataset);
}

function drawBars(bars) {
    console.log("draw bars");
    bars.enter()
        .append("rect");
}

function drawLabels(labels) {
    console.log("draw labels")
    labels.enter()
        .append("text")
        .attr("text-anchor","middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "black");
}

function sizeBars(bars, dataset) {
    console.log("size bars")
    var barPadding=0;
    scale = d3.scale.linear()
        .domain([0, d3.max(dataset)])
        .range([0, chartHeight * 0.9]);

    colWidth = chartWidth / dataset.length;
    barWidth = colWidth - barPadding;


    bars.transition()
        .duration(300)
        .attr("x", function(dataValue, i) {
            return i * colWidth;
        })
        .attr("y", function(dataValue) {
            return chartHeight - scale(dataValue);
        })
        .attr("height", function(dataValue) {
            return scale(dataValue);
        })
        .attr("width", barWidth)
        .attr("fill", function(dataValue, i) {
            var num = parseInt("6d23ff", 16)
            var percent = (i + 1) / dataset.length * 35;
            amt = Math.round(2.55 * percent),
                R = (num >> 16) + amt,
                B = (num >> 8 & 0x00FF) + amt,
                G = (num & 0x0000FF) + amt;
            var color = (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
            return "#" + color;
        });
}

function positionLabels(labels, dataset) {
    console.log("position labels")
    labels.transition()
        .duration(300)
        .text(function(dataValue) {
            return dataValue;
        })
        .attr("x", function(dataValue, i) {
            return i * colWidth + barWidth / 2;
        })
        .attr("y", function(dataValue) {
            return chartHeight - scale(dataValue)-5;
        });

}
*/
