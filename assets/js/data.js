$('#button-chart-plot-previous').on("click", function() {
    var change = parseInt($('#button-chart-plot-next').attr('change'));

    var min = parseInt($('#button-chart-plot-previous').attr('min'));
    min = min - change;
    $('#button-chart-plot-previous').attr('min', parseInt(min));
    var max = parseInt($('#button-chart-plot-next').attr('max'));
    max = max - change;
    $('#button-chart-plot-next').attr('max', parseInt(max));
    defineChartData();
    //   retrievePostcodeData(ndx,min,max)
})

$('#button-chart-plot-next').on("click", function() {
    var change = parseInt($('#button-chart-plot-next').attr('change'));

    var min = parseInt($('#button-chart-plot-previous').attr('min'));
    min += change;
    $('#button-chart-plot-previous').attr('min', parseInt(min));
    var max = parseInt($('#button-chart-plot-next').attr('max'));
    max += change;
    $('#button-chart-plot-next').attr('max', parseInt(max));
    defineChartData();
    //   retrievePostcodeData(ndx,min,max)
})

var ndx;
var chart;
var colWidth;
var barWidth;
var barChartWidth;
var barChartHeight;
var rowChartHeight;
var rowChartWidth;
var pieChartHeight;
var scale;
var dataset = [0];

//load in csv of schools into schoolData crossfilter
function defineChartData() {
    var postcode = $('#chart-address').val();
    if (postcode != "") {
        barChartWidth = $("#data-tab--chart-bar").width();
        barChartHeight = $("#data-tab--chart-bar").height();
        rowChartHeight = $("#data-tab--chart-row").height();
        rowChartWidth = $("#data-tab--chart-row").width();
        pieChartHeight = $("#data-tab--chart-pie").height();
        $('#data-tab--chart-area img').css('display', 'block');
        queue()
            .defer(d3.csv, 'assets/data/schools.csv')
            .await(loadData);
    }
    else {
        $('#error-message').text('Please enter a postcode.');
        $("#errorModal").modal({
            show: 'true',
            backdrop: 'static',
            keyboard: 'false'
        });
        setTimeout(function() {
            $("#errorModal").modal('hide');
        }, 2000);
    }

    function loadData(error, schoolData) {
        ndx = crossfilter(schoolData);
        $('#data-tab--chart-area img').css('display', 'none');
        filterByPostcode(ndx, 0, 0);
    }
}

//check user submitted postcode and filter schoolData based on postcode submitted
function filterByPostcode(schoolData, minCount, maxCount) {
    //get user submitted postcode
    minCount = $('#button-chart-plot-previous').attr('min');
    maxCount = $('#button-chart-plot-next').attr('max');

    var postcode = $('#chart-address').val();
    postcode = postcode.toUpperCase();
    if (postcode.endsWith('*') == true) {
        postcode = postcode.substr(0, postcode.length - 1);
    }
    else {
        postcode = postcode + " ";
    }

    //create dimension of multiple arrays for filtering
    local_schools_dim = schoolData.dimension(function(d) {
        return {
            Postcode: d.Postcode,
            'EstablishmentStatus (code)': d['EstablishmentStatus (code)'],
            EstablishmentName: d.EstablishmentName,
            NumberOfPupils: d.NumberOfPupils,
            NumberOfBoys: d.NumberOfBoys,
            NumberOfGirls: d.NumberOfGirls,
            SchoolCapacity: d.SchoolCapacity
        }

    })
    var count = 0;

    //filter dimension to exclude postcodes that do not partial match user submitted postcode
    //and schools that are closed
    //and schools that provide no information on pupil numbers
    local_schools_dim.filter(function(d) {
        //count the results and filter those records that exceed the max or fall below the minimm record number
        //this ensures not too many results are displayed on the chart
        if (checkPostcode(postcode, d.Postcode) == false || d['EstablishmentStatus (code)'] != 1 || (d.NumberOfBoys + d.NumberOfGirls == 0)) {
            return d;
        }
        else if (count != 0 && (count < minCount || count >= maxCount)) {
            count++;
            return d;
        }
        else {
            count++;
        }
    });
    var displayedCount = 0;
    if (maxCount > count) {
        displayedCount = count;
    }
    else {
        displayedCount = maxCount;
    }
    $('#data-tab--total-schools').text(count);
    $('#data-tab--total-schools-range').text(minCount + ' to ' + displayedCount);
    schoolData.remove();
    local_schools_dim.filter(null);
    var resultsRange = $("#button-chart-plot-next").attr('change');
    if (count > maxCount) {
        $("#button-chart-plot-next").show();
    }
    else {
        $("#button-chart-plot-next").hide();
    }
    if (minCount >= resultsRange) {
        $("#button-chart-plot-previous").show();
    }
    else {
        $("#button-chart-plot-previous").hide();
    }




    //render charts
    renderOfstedSelector(schoolData, postcode);
    renderSENSelector(schoolData, postcode);
    renderChart(schoolData);
}

//check the user submitted postcode against the postcode data taken from the csv - if partial match return false else true
//in order to filter out of dimension
function checkPostcode(selectedPostcode, schoolPostcode) {
    if (schoolPostcode.startsWith(selectedPostcode) == true || selectedPostcode == "") {
        return true;
    }
    else {
        return false;
    }
}

//create a selector to show schools based on ofsted rating
function renderOfstedSelector(schoolData, postcode) {
    var rating_dim = schoolData.dimension(function(d) {
        //ensure data entered into selector is in correct format - if no entry in csv create entry of ofsted rating "none"
        if (d['OfstedRating (name)'] == "") {
            d['OfstedRating (name)'] = "None"
        }
        //filter out postcodes
        if (checkPostcode(postcode, d.Postcode)) {
            return d['OfstedRating (name)'];
        }
    })
    var ratingSelector = rating_dim.group();
    dc.selectMenu("#data-tab--chart-selector-ofsted")
        .dimension(rating_dim)
        .group(ratingSelector);
}

//create second selector to show schools based on SEN classes offered.
function renderSENSelector(schoolData, postcode) {
    var SEN_dim = schoolData.dimension(function(d) {
        var SEN;
        //filter out postcodes
        //loop needed as 13 columns for different types of SEN classes offered.
        for (i = 1; i <= 13; i++) {
            if (checkPostcode(postcode, d.Postcode)) {
                //only return d if postcode and SEN class are correct
                SEN = d['SEN' + i + ' (name)'];
                if (SEN == "") {
                    SEN = "None";
                }
                else {
                    SEN = SEN.substring(0, SEN.indexOf('-'));
                }
                return SEN;

            }
        }
    })
    var SENSelector = SEN_dim.group();
    dc.selectMenu("#data-tab--chart-selector-SEN")
        .dimension(SEN_dim)
        .group(SENSelector);
}

//draw chart of number of pupils per school
function renderChart(schoolData) {

    $('.data-tab--chart-title').css('display', 'block');

    schools_dim = schoolData.dimension(dc.pluck('EstablishmentName'));
    establishment_type_dim = schoolData.dimension(dc.pluck('TypeOfEstablishment (name)'));


    function addSchool(p, v) {
        //calculate remaining school capacity
        p.capacity += parseInt(v.SchoolCapacity) - parseInt(v.NumberOfBoys) - parseInt(v.NumberOfGirls);
        //if oversubscribed set remaining capacity to 0
        if (p.capacity < 0) {
            p.capacity = 0;
        }
        return p;
    }

    function removeSchool(p, v) {
        //set school capacity to 0 - removing from filtered results
        p.capacity = 0;
        return p;
    }

    function initialiseSchool() {
        return { capacity: 0 };
    }

    var boy_pupils_per_school = schools_dim.group().reduceSum(dc.pluck('NumberOfBoys'));
    var girl_pupils_per_school = schools_dim.group().reduceSum(dc.pluck('NumberOfGirls'));
    var school_capacity = schools_dim.group().reduceSum(function(d) {
        //if School capacity not defined in csv calculate it as total pupils
        if (d.SchoolCapacity == "") {
            d.SchoolCapacity = parseInt(d.NumberOfGirls) + parseInt(d.NumberOfBoys);
        }
        else {
            d.SchoolCapacity = parseInt(d.SchoolCapacity);
        }
        return d.SchoolCapacity;
    });

    var reduced_school_capacity = schools_dim.group().reduce(addSchool, removeSchool, initialiseSchool);

    var numberOfPupilsChart = dc.barChart('#data-tab--chart-bar');

    if ($('#select-total-pupils').is(':checked')) {
        //display chart based on the total girls and boys at the school, showing, also remaining capacity
        numberOfPupilsChart
            .width(barChartWidth)
            .height(barChartHeight)
            .margins({ top: 60, right: 50, bottom: 30, left: 70 })
            .dimension(schools_dim)
            .group(boy_pupils_per_school, "Boys")
            .stack(girl_pupils_per_school, "Girls")
            .stack(reduced_school_capacity, "Remaining Spaces", function(d) { return d.value.capacity })
            .transitionDuration(500)
            .x(d3.scale.ordinal())
            .xAxisLabel("School")
            .xUnits(dc.units.ordinal)
            .legend(dc.legend().x(50).y(0).itemHeight(15).gap(5))
            .elasticY(true)
            .yAxisLabel("Number of Pupils")
            .yAxis().ticks(10);
    }
    else if ($('#select-school-capacity').is(':checked')) {
        //display chart just setting out total school pupil capacity
        numberOfPupilsChart
            .width(barChartWidth)
            .height(barChartHeight)
            .margins({ top: 60, right: 50, bottom: 30, left: 70 })
            .dimension(schools_dim)
            .group(school_capacity, "Total Capacity")
            .transitionDuration(500)
            .x(d3.scale.ordinal())
            .xAxisLabel("School")
            .xUnits(dc.units.ordinal)
            .legend(dc.legend().x(50).y(0).itemHeight(15).gap(5))
            .elasticY(true)
            .yAxisLabel("Number of Pupils")
            .yAxis().ticks(10);
    }
    numberOfPupilsChart
        .ordinalColors(["#7b3bfc", "#884ffb", "#9c6df9"])
        .on('renderlet', function(numberOfPupilsChart) {
            numberOfPupilsChart.selectAll('rect.bar')
                .on("mouseover.namechange", function(d) {
                    barPosition = $(this).index();
                    barFullName = $('g.x text').eq(barPosition).attr('full-name');
                    $('g.x text').eq(barPosition).text(barFullName);
                })
                .on("mouseout.namechange", function(d) {
                    barPosition = $(this).index();
                    barShortName = $('g.x text').eq(barPosition).attr('short-name');
                    $('g.x text').eq(barPosition).text(barShortName);
                });
            numberOfPupilsChart.selectAll('g.x text')
                .attr('transform', 'translate(-12.5,-120) rotate(270)')
                .attr('full-name', function(d) { return d })
                .attr('short-name', function(d) {
                    if (d.length > 30) {
                        return d.substr(0, 30) + '...';
                    }
                })
                .text(function(d) {
                    if (d.length > 30) {
                        return d.substr(0, 30) + '...';
                    }
                    else {
                        return d;
                    }
                });
            numberOfPupilsChart.selectAll('rect.bar title')
                .text(function(d) {
                    if (d.layer != "Remaining Spaces") {
                        return d.x + ": " + d.data.value
                    }
                    else {
                        return d.x + ": " + d.data.value.capacity
                    }
                });
        })

    //percentage calcs custom reduce


    function initialiseEstablishments() {
        return { schoolCount: 0, averagePupilDensity: 0, totalPupils: 0 }
    }

    function addEstablishment(p, v) {
        //   p.totalPupilCount+=parseInt(v.NumberOfPupils);
        p.schoolCount++;
        p.totalPupils += parseInt(v.NumberOfPupils);
        p.averagePupilDensity = p.totalPupils / p.schoolCount;
        p.averagePupilDensity = Math.round(p.averagePupilDensity);
        return p;
    }

    function removeEstablishment(p, v) {
        //set school capacity to 0 - removing from filtered results
        p.schoolCount--;
        if (p.schoolCount == 0) {
            p.totalPupils = 0;
            p.averagePupilDensity = 0;
        }
        else {
            p.totalPupils -= parseInt(v.NumberOfPupils);
            p.averagePupilDensity = p.totalPupils / p.schoolCount;
            p.averagePupilDensity = Math.round(p.averagePupilDensity);
        }
        return p;
    }

    //    var total_pupils_per_establishment = establishment_type_dim.group().reduceSum(dc.pluck('NumberOfPupils'));
    var total_pupils_per_establishment = establishment_type_dim.group().reduce(addEstablishment, removeEstablishment, initialiseEstablishments);
    var pupilsPerEstablishmentChart = dc.pieChart('#data-tab--chart-pie');
    pupilsPerEstablishmentChart
        .height(pieChartHeight)
        .radius(90)
        .innerRadius(pieChartHeight / 5)
        .transitionDuration(1500)
        .dimension(establishment_type_dim)
        .group(total_pupils_per_establishment)
        .valueAccessor(function(p) {
            return p.value.averagePupilDensity;
        })
        .ordinalColors(['#6d23ff', '#7b3bfc', '#8b54fb', '#884ffb', '#9c6df9'])
        .on('pretransition', function(pupilsPerEstablishmentChart) {
            pupilsPerEstablishmentChart.selectAll('text.pie-slice')
                .text(function(d) {
                    percentageOfPupils = dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2 * Math.PI) * 100);
                    if (percentageOfPupils > 0) {
                        var pupilPercentage = parseFloat(percentageOfPupils).toFixed(2);
                        return pupilPercentage + '%';
                    }
                    else {
                        return " ";
                    }
                })
                .style('fill', 'black')
        });

    function initialisePhase() {
        return { phaseCount: 0 }
    }

    function addPhase(p, v) {
        //   p.totalPupilCount+=parseInt(v.NumberOfPupils);
        p.phaseCount++;
        return p;
    }

    function removePhase(p, v) {
        //set school capacity to 0 - removing from filtered results
        p.phaseCount--;

        return p;
    }

    phase_balance_dim = schoolData.dimension(dc.pluck('PhaseOfEducation (name)'));


    var total_schools_phase_balance = phase_balance_dim.group().reduce(addPhase, removePhase, initialisePhase);
    var phaseBalanceChart = dc.rowChart('#data-tab--chart-row');

    phaseBalanceChart
        .width(rowChartWidth)
        .height(rowChartHeight)
        .x(d3.scale.linear().domain([0, 10]))
        .ordinalColors(['#6d23ff', '#7b3bfc', '#9c6df9'])
        .elasticX(true)
        .dimension(phase_balance_dim)
        .group(total_schools_phase_balance)
        .valueAccessor(function(d) {
            return d.value.phaseCount;
        })
        .on('pretransition', function(phaseBalanceChart) {
            phaseBalanceChart.selectAll('text')
                .style('fill', 'black')
        });

    dc.renderAll();
}

/* For testing - function to print out contents of crossfilter
function print_filter(filter) {
    var f = eval(filter);
    if (typeof(f.length) != "undefined") {}
    else {}
    if (typeof(f.top) != "undefined") { f = f.top(Infinity); }
    else {}
    if (typeof(f.dimension) != "undefined") { f = f.dimension(function(d) { return ""; }).top(Infinity); }
    else {}
    console.log(filter + "(" + f.length + ") = " + JSON.stringify(f).replace("[", "[\n\t").replace(/}\,/g, "},\n\t").replace("]", "\n]"));
}*/

/*For testing - function to print out contents of dimension
    /*    dimData = establishment_type_dim.top(Infinity);
        dimData.forEach(function(x) {
            //        console.log(JSON.stringify(x));
        });*/
        