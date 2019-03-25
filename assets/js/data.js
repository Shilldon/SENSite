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

function defineChartData() {
    var postcodePart1 = $('#chart-address-1').val();
    var postcodePart2 = $('#chart-address-2').val();
    var postcode;
    console.log(postcode)
    postcode = postcodePart1 + " " + postcodePart2;
    postcode = postcode.toUpperCase();

    schoolArray=createLocalSchoolsArray(postcode);
    console.log(schoolArray)
    defineChart(schoolArray);
}

function defineChart(schoolArray) {
    var dataset = [];
    
    for (j = 0; j <= schoolArray.length - 1; j++) {
        var pupils = parseInt(schoolArray[j][39]);
        if (pupils > 0) {
            dataset.push(pupils);
        }
        else {
            dataset.push(0);
        }
    }

    var chartWidth = 1000;
    var chartHeight = $("#data-tab--chart").height();
    var barPadding = 0;


    var scale = d3.scale.linear()
        .domain([0, d3.max(dataset)])
        .range([0, chartHeight * 0.9]);


    var colWidth = chartWidth / dataset.length;
    var barWidth = colWidth - barPadding;
    var chart = d3.select("#data-tab--chart")
        .append("svg")
        .attr("height", chartHeight)
        .attr("width", chartWidth);

    chart.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function(dataValue, i) {
            return i * colWidth;
        })
        .attr("y", function(dataValue) {
            return chartHeight - scale(dataValue);
        })
        .attr("height", function(dataValue) {
            return scale(dataValue);
        })
        .attr("width", barWidth);

    chart.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .text(function(dataValue) {
            return dataValue;
        })
        .attr("text-anchor", "middle")
        .attr("x", function(dataValue, i) {
            return i * colWidth + barWidth / 2;
        })
        .attr("y", function(dataValue) {
            return chartHeight - scale(dataValue) + 14;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "#7b3bfc");
}
