//User can select how many results to display per chart.
//If the total results exceed the user's specified maximum then the next and previous buttons
//enable the user to scroll through the results.

$('#button-chart-plot-previous').on("click", function() {
    var change = parseInt($('#button-chart-plot-next').attr('change'));
    var min = parseInt($('#button-chart-plot-previous').attr('min'));
    min = min - change;
    $('#button-chart-plot-previous').attr('min', parseInt(min));
    var max = parseInt($('#button-chart-plot-next').attr('max'));
    max = max - change;
    $('#button-chart-plot-next').attr('max', parseInt(max));
    defineChartData();
});

$('#button-chart-plot-next').on("click", function() {
    var change = parseInt($('#button-chart-plot-next').attr('change'));

    var min = parseInt($('#button-chart-plot-previous').attr('min'));
    min += change;
    $('#button-chart-plot-previous').attr('min', parseInt(min));
    var max = parseInt($('#button-chart-plot-next').attr('max'));
    max += change;
    $('#button-chart-plot-next').attr('max', parseInt(max));
    defineChartData();
});


//set initial values of next and previous buttons for displaying schools on charts
//in order to ensure the correct results are displayed on clicking the buttons
function initialiseForNextButtons() {
        $('#button-chart-plot-previous').attr('min', 1);
        var maxValue = $("#max-results").val();
        $('#button-chart-plot-next').attr('max', maxValue);
        $('#button-chart-plot-next').attr('change', maxValue);     
}

//load in csv of schools into schoolData crossfilter
function defineChartData() {
    var postcode = $('#chart-address').val();
    if (postcode != "") {
        //There could be a large number of results and while they are processed display an
        //indication to the user that data is being processed by showing the "loading GIF"
        $('#data-tab--chart-area img').css('display', 'block');
        //hide the chart
        $('#data-tab--chart-object').css('display','none');
        queue()
            .defer(d3.csv, 'assets/data/schools.csv')
            .await(loadData);
    }
    //if the user fails to provide a valid postcode display an error
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
        var ndx = crossfilter(schoolData);
        //hide the loading gif after the data is loaded
        $('#data-tab--chart-area img').css('display', 'none');
        //display the chart
        $('#data-tab--chart-object').css('display','block');        
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
    var local_schools_dim = schoolData.dimension(function(d) {
        return {
            Postcode: d.Postcode,
            'EstablishmentStatus (code)': d['EstablishmentStatus (code)'],
            EstablishmentName: d.EstablishmentName,
            NumberOfPupils: d.NumberOfPupils,
            NumberOfBoys: d.NumberOfBoys,
            NumberOfGirls: d.NumberOfGirls,
            SchoolCapacity: d.SchoolCapacity
        };

    });
    var count = 0;

    //filter dimension to exclude postcodes that do not partial match user submitted postcode
    //and schools that are closed
    //and schools that provide no information on pupil numbers
    //in order to generate meaningful results
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
    //need to show or hide next and previous buttons depending on whether the results exceed the user
    //specified maximum
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
            d['OfstedRating (name)'] = "None";
        }
        //filter out postcodes
        if (checkPostcode(postcode, d.Postcode)) {
            return d['OfstedRating (name)'];
        }
    });
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
    });
    var SENSelector = SEN_dim.group();
    
    dc.selectMenu("#data-tab--chart-selector-SEN")
        .dimension(SEN_dim)
        .group(SENSelector);
}


//This displays a Pie chart to provided the user with information on the total number of schools 
//at each educational phase in the searched area (e.g. nursery, secondary etc)
function renderPhaseChart(schoolData) {
    console.log("rendering phase chart")
    var rowChartHeight = $("#data-tab--chart-object").height();
    var rowChartWidth = $("#data-tab--chart-object").width();
    
    function initialisePhase() {
        return { phaseCount: 0 };
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

    var phase_balance_dim = schoolData.dimension(dc.pluck('PhaseOfEducation (name)'));


    var total_schools_phase_balance = phase_balance_dim.group().reduce(addPhase, removePhase, initialisePhase);
    var phaseBalanceChart = dc.rowChart('#data-tab--chart-object');

    phaseBalanceChart
        .width(rowChartWidth)
        .height(rowChartHeight)
        .x(d3.scale.linear().domain([0, 10]))
        //choose easy to distinguish ordinal colours
        .ordinalColors(["#56048C", "#C866F2", "#C391D9"])
        .elasticX(true)
        .dimension(phase_balance_dim)
        .group(total_schools_phase_balance)
        .valueAccessor(function(d) {
            return d.value.phaseCount;
        })
        //need to ensure the correct colour text for ease of reading
        .on('pretransition', function(phaseBalanceChart) {
            phaseBalanceChart.selectAll('text')
                .style('fill', 'black');
        });
 
    dc.renderAll();      
        
}


//This chart displays the number of pupils at each school in the searched postcode which the user
//can choose to show broken down between gender
function renderPupilsChart(schoolData) {
    //get chart size to ensure the chart is displayed properly in the viewing area.
    var barChartWidth = $("#data-tab--chart-object").width();
    var barChartHeight = $("#data-tab--chart-object").height();


    var schools_dim = schoolData.dimension(dc.pluck('EstablishmentName'));
    var establishment_type_dim = schoolData.dimension(dc.pluck('TypeOfEstablishment (name)'));


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

    var numberOfPupilsChart = dc.barChart('#data-tab--chart-object');

    if ($('#select-total-pupils').is(':checked')) {
        //display chart based on the total girls and boys at the school, showing, also remaining capacity
        numberOfPupilsChart
            .width(barChartWidth)
            .height(barChartHeight)
            .margins({ top: 60, right: 20, bottom: 15, left: 70 })
            .dimension(schools_dim)
            .group(boy_pupils_per_school, "Boys")
            .stack(girl_pupils_per_school, "Girls")
            .stack(reduced_school_capacity, "Remaining Spaces", function(d) { return d.value.capacity; })
            .transitionDuration(500)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .legend(dc.legend().x(50).y(5).itemHeight(15).gap(5))
            .elasticY(true)
            .yAxisLabel("Number of Pupils")
            .yAxis().ticks(10);
    }
    else if ($('#select-school-capacity').is(':checked')) {
        //display chart just setting out total school pupil capacity
        numberOfPupilsChart
            .width(barChartWidth)
            .height(barChartHeight)
            .margins({ top: 60, right: 20, bottom: 10, left: 70 })
            .dimension(schools_dim)
            .group(school_capacity, "Total Capacity")
            .transitionDuration(500)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .legend(dc.legend().x(50).y(5).itemHeight(15).gap(5))
            .elasticY(true)
            .yAxisLabel("Number of Pupils")
            .yAxis().ticks(10);
    }
    numberOfPupilsChart
        .ordinalColors(["#56048C", "#C866F2", "#C391D9"])
        .on('renderlet', function(numberOfPupilsChart) {
            numberOfPupilsChart.selectAll('rect.bar')
                .on("mouseover.namechange", function(d) {
                    var barPosition = $(this).index();
                    var barFullName = $('g.x text').eq(barPosition).attr('full-name');
                    $('g.x text').eq(barPosition).text(barFullName);
                })
                .on("mouseout.namechange", function(d) {
                    var barPosition = $(this).index();
                    var barShortName = $('g.x text').eq(barPosition).attr('short-name');
                    $('g.x text').eq(barPosition).text(barShortName);
                });
            numberOfPupilsChart.selectAll('g.x text')
                .attr('transform', 'translate(-12.5,-120) rotate(270)')
                .attr('full-name', function(d) {  return d; })
                .attr('short-name', function(d) {
                    if (d.length > 30) {
                        return d.substr(0, 30) + '...';
                    }
                })
                .attr('style', function() {
                    return $(this).attr('style')+' font-size:10px';
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
                        return d.x + ": " + d.data.value;
                    }
                    else {
                        return d.x + ": " + d.data.value.capacity;
                    }
                });
        });
  
    dc.renderAll();      
}

//This chart displays the percentage of pupils in the searched postcode that attend different types of funded schools
//e.g. state or private funded.
function renderDensityChart(schoolData) {
    //percentage calcs custom reduce

    var pieChartHeight = $("#data-tab--chart-object").height();

    function initialiseEstablishments() {
        return { schoolCount: 0, averagePupilDensity: 0, totalPupils: 0 };
    }

    function addEstablishment(p, v) {
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

    var establishment_type_dim = schoolData.dimension(dc.pluck('TypeOfEstablishment (name)'));
    var total_pupils_per_establishment = establishment_type_dim.group().reduce(addEstablishment, removeEstablishment, initialiseEstablishments);
    var pupilsPerEstablishmentChart = dc.pieChart('#data-tab--chart-object');
    
    pupilsPerEstablishmentChart
        .height(pieChartHeight)
        .radius(150)
        .innerRadius(pieChartHeight /20)
        .transitionDuration(1500)
        .dimension(establishment_type_dim)
        .legend(dc.legend().x(50).y(5).itemHeight(15).gap(5))
        .group(total_pupils_per_establishment)
        .valueAccessor(function(p) {
            return p.value.averagePupilDensity;
        })
        .ordinalColors(['#56048C', '#9126BF', '#C866F2', '#C391D9', '#F2D8EE'])
        .on('pretransition', function(pupilsPerEstablishmentChart) {
            pupilsPerEstablishmentChart.selectAll('text.pie-slice')
                .text(function(d) {
                    var percentageOfPupils = dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2 * Math.PI) * 100);
                    if (percentageOfPupils > 0) {
                        var pupilPercentage = parseFloat(percentageOfPupils).toFixed(2);
                        return pupilPercentage + '%';
                    }
                    else {
                        return " ";
                    }
                })
                .style('fill', 'black');
        });    
    dc.renderAll();      
        
}

//draw chart of number of pupils per school
function renderChart(schoolData) {
    var chartType=$("#data-tab--chart-object").attr("chart_type");
    if(chartType==undefined) {
        chartType="pupils";
    }
    switch(chartType) {
        case "pupils": console.log("pupils"); renderPupilsChart(schoolData); break;    
        case "density": console.log("density"); renderDensityChart(schoolData); break;    
        case "phase":console.log("phase"); renderPhaseChart(schoolData); break;    
    }
    $('.data-tab--chart-title').css('display', 'block');
}


