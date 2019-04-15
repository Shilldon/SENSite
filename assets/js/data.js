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
var pieChartWidth;
var pieChartHeight;
var scale;
var dataset = [0];

//load in csv of schools into schoolData crossfilter
function defineChartData() {
    var postcode = $('#chart-address').val();
    if (postcode != "") {
        barChartWidth = $("#data-tab--chart-area").width()*0.8;
        console.log(barChartWidth);
        barChartHeight = $("#data-tab--chart-area").height()*0.9;
    //    pieChartWidth=$("#data-tab--chart-area").width()*0.15;
        pieChartHeight=$("#data-tab--chart-area").width()*0.15;
       $('#data-tab--chart-area img').css('display', 'block');
        queue()
            .defer(d3.csv, 'assets/data/schools.csv')
            .await(loadData);
    }
    else {
        alert("enter postcode")
    }

    function loadData(error, schoolData) {
        //  $('#data-tab--chart-bar').css('display','block');
        ndx = crossfilter(schoolData);
        //    if ($("#data-tab--chart-national-tab").css('display') == 'none') {
        $('#data-tab--chart-area img').css('display', 'none');
        filterByPostcode(ndx, 0, 0);

        /*    }
            else {
                renderNationalChart(ndx)
            }*/
    }
}

function print_filter(filter) {
    var f = eval(filter);
    if (typeof(f.length) != "undefined") {}
    else {}
    if (typeof(f.top) != "undefined") { f = f.top(Infinity); }
    else {}
    if (typeof(f.dimension) != "undefined") { f = f.dimension(function(d) { return ""; }).top(Infinity); }
    else {}
    console.log(filter + "(" + f.length + ") = " + JSON.stringify(f).replace("[", "[\n\t").replace(/}\,/g, "},\n\t").replace("]", "\n]"));
}

//check user submitted postcode and filter schoolData based on postcode submitted
function filterByPostcode(schoolData, minCount, maxCount) {
    //get user submitted postcode
    minCount = $('#button-chart-plot-previous').attr('min');

    maxCount = $('#button-chart-plot-next').attr('max');
    console.log("maxCount" + maxCount)
    //   console.log("max=" + maxCount + " min=" + minCount)

    /*  var postcodePart1 = $('#chart-address-1').val();
      var postcodePart2 = $('#chart-address-2').val();
      var postcode=postcodePart1;
      if(postcodePart2!=""){
      postcode = postcodePart1 + " " + postcodePart2;
      }*/
    var postcode = $('#chart-address').val();
    postcode = postcode.toUpperCase();
    if (postcode.endsWith('*') == true) {
        console.log("postcode before mod=" + postcode)
        postcode = postcode.substr(0, postcode.length - 1);
        console.log("postcode after mod=" + postcode)
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
        else if (count < minCount || count > maxCount) {
            count++;
            return d;
        }
        else {
          //  $('#data-tab--total-schools').text(count);
            count++;
            //         console.log(count)
        }
    });
$('#data-tab--total-schools').text(count);        
    
    schoolData.remove();
    local_schools_dim.filter(null);
    var resultsRange = $("#button-chart-plot-next").attr('change');
    if (count >= maxCount) {
        //     console.log("count more than max")
        $("#button-chart-plot-next").show();
    }
    else {
        //   console.log("count less than max")
        $("#button-chart-plot-next").hide();
    }
    if (minCount >= resultsRange) {
        //   console.log("mincount more than 25")
        $("#button-chart-plot-previous").show();
    }
    else {
        //       console.log("mincount less than 25")

        $("#button-chart-plot-previous").hide();
    }

    new_schools_dim = schoolData.dimension(dc.pluck('EstablishmentName'));
    establishment_type_dim = schoolData.dimension(dc.pluck('TypeOfEstablishment (name)'));
    dimData = establishment_type_dim.top(Infinity);
    dimData.forEach(function(x) {
        //        console.log(JSON.stringify(x));
    });


    //render charts
    renderOfstedSelector(schoolData, postcode);
    renderSENSelector(schoolData, postcode);
    //    renderPieChart(schoolData);
    renderRegionalChart(new_schools_dim, establishment_type_dim);
}

//check the user submitted postcode against the postcode data taken from the csv - if partial match return true else false
function checkPostcode(selectedPostcode, schoolPostcode) {
    if (schoolPostcode.search(selectedPostcode) != -1 || selectedPostcode == "") {
        //     console.log("postcode checked" + schoolPostcode + " returned true")
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
    dc.selectMenu("#data-tab--chart-selector-regional")
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
                //               console.log(SEN)
                if (SEN == "") {
                    SEN = "None";
                }
                else {
                    SEN = SEN.substring(SEN.indexOf("-") + 1);
                }
                return SEN;

            }
        }
    })
    var SENSelector = SEN_dim.group();
    dc.selectMenu("#data-tab--chart-selector2-regional")
        .dimension(SEN_dim)
        .group(SENSelector);
}

//draw chart of number of pupils per school
function renderRegionalChart(schools_dim, establishment_type_dim) {
    //   console.log("rendering regional chart");

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
            .margins({ top: 40, right: 50, bottom: 30, left: 50 })
            .dimension(schools_dim)
            .group(boy_pupils_per_school, "Boys")
            .stack(girl_pupils_per_school, "Girls")
            .stack(reduced_school_capacity, "Remaining Spaces", function(d) { return d.value.capacity })
            .transitionDuration(500)
            .x(d3.scale.ordinal())
            .xAxisLabel("School")
            .xUnits(dc.units.ordinal)
            .legend(dc.legend().x(420).y(0).itemHeight(15).gap(5))
            .elasticY(true)
            .yAxisLabel("Number of Pupils")
            .yAxis().ticks(20);
    }
    else if ($('#select-school-capacity').is(':checked')) {
        //display chart just setting out total school pupil capacity
        numberOfPupilsChart
            .width(barChartWidth)
            .height(barChartHeight)
            .margins({ top: 20, right: 50, bottom: 30, left: 50 })
            .dimension(schools_dim)
            .group(school_capacity, "Total Capacity")
            .transitionDuration(500)
            .x(d3.scale.ordinal())
            .xAxisLabel("School")
            .xUnits(dc.units.ordinal)
            .legend(dc.legend().x(420).y(0).itemHeight(15).gap(5))
            .elasticY(true)
            .yAxisLabel("Number of Pupils")
            .yAxis().ticks(20);
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
        }
        return p;
    }

    //    var total_pupils_per_establishment = establishment_type_dim.group().reduceSum(dc.pluck('NumberOfPupils'));
    var total_pupils_per_establishment = establishment_type_dim.group().reduce(addEstablishment, removeEstablishment, initialiseEstablishments);
    var pupilsPerEstablishmentChart = dc.pieChart('#PieChart');
    pupilsPerEstablishmentChart
        .height(pieChartHeight)
        .radius(90)
        .innerRadius(pieChartHeight/5)
        .transitionDuration(1500)
        .dimension(establishment_type_dim)
        .group(total_pupils_per_establishment)
        .valueAccessor(function(p) {
            return p.value.averagePupilDensity;
        })
        .ordinalColors(['#6d23ff', '#7b3bfc', '#8b54fb', '#884ffb', '#9c6df9'])
/*        .on('renderlet', function(pupilsPerEstablishmentChart) {
            pupilsPerEstablishmentChart.selectAll('text.pie-slice')
             //   .style('fill', 'black')
            //    .attr('text-anchor','left')
                .on("mouseover.namechange", function(d) {
pupilsPerEstablishmentChart.selectAll('text.pie-slice')
                .text(function(d) {
                    return d.data.key;
                })
                })            
        })*/
        .on('pretransition', function(pupilsPerEstablishmentChart) {
            pupilsPerEstablishmentChart.selectAll('text.pie-slice')
                .text(function(d) {
                    percentageOfPupils=dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2 * Math.PI) * 100);
                    if(percentageOfPupils>0) {
                        return percentageOfPupils + '%';;
                    }
                    else {
                        return " ";
                    }
                })
                .style('fill', 'black')
        });

    dc.renderAll();
}
/*
function renderNationalChart(schoolData) {
//    console.log("rendering national chart");

    function addSchool(p, v) {
        p.count++;
        p.total += 1;
        //      console.log("remove "+v['EstablishmentTypeGroup (name)']+" total "+p.total);
        return p;
    }

    function removeSchool(p, v) {
        p.count--;
        if (p.count == 0) {
            p.total = 0;
        }
        else {
            p.total--;
        }
        //     console.log("remove "+v['EstablishmentTypeGroup (name)']+" total "+p.total);
        return p;
    }

    function initialise() {
        return { count: 0, total: 0 };
    }

    var establishment_dim = schoolData.dimension(dc.pluck('EstablishmentTypeGroup (name)'));
    var establishment_categories = establishment_dim.group().reduce(addSchool, removeSchool, initialise);

    var establishmentChart = dc.barChart('#data-tab--chart-national');
    var xAxis = d3.svg.axis();



    establishmentChart
        .width(barChartWidth)
        .height(barChartHeight)
        .margins({ top: 20, right: 50, bottom: 30, left: 50 })
        .dimension(establishment_dim)
        .group(establishment_categories, "Type of Establishment")
        .valueAccessor(function(d) {
            return d.value.total;
        })
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xAxisLabel("Type of Establishment")
        .on('renderlet', (function(chart) {
            establishmentChart.selectAll('g.x text')
                .attr('style', function getTextWidth(text, font) {
                    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
                    var context = canvas.getContext("2d");
                    context.font = font;
                    var metrics = context.measureText(text);
                    var barLabelWidth=$('rect').attr('width');
                    var percentageChange=parseInt(barLabelWidth)/metrics.width;
                    var currentFontSize=$(this).css('font-size');
                    currentFontSize=parseInt(currentFontSize);
                    var newFontSize=Math.floor(currentFontSize*percentageChange);
                    if(metrics.width>$('rect').attr('width')) {
                        return ($(this).attr('style')+'; font-size:'+newFontSize+'px');
                    }
                    else {
                        return $(this).attr('style');
                    }
                });
        }))
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .yAxisLabel("Number of Establishments")
        .yAxis().ticks(20);
    dc.renderAll();
}
*/
/*
function renderPieChart(schoolData) {

    function addPupils(p, v) {
        p.count++;
        p.totalBoys += v.NumberOfBoys;
        p.totalGirls += v.NumberOfGirls;
        //      console.log("remove "+v['EstablishmentTypeGroup (name)']+" total "+p.total);
        return p.totalBoys, p.totalGirls;
    }

    function removePupils(p, v) {
        p.count--;
        if (p.count == 0) {
            p.totalBoys = 0;
            p.totalGirls = 0;
        }
        else {
            p.totalBoys -= v.NumberOfBoys;
            p.totalGirls -= v.NumberOfGirls;
        }
        //     console.log("remove "+v['EstablishmentTypeGroup (name)']+" total "+p.total);
        return p.totalBoys, p.totalGirls;
    }

    function initialisePupils() {
        return { count: 0, totalBoys: 0, totalGirls: 0 };
    }

/*    var girls_or_boys = schoolData.dimension(function(d) {
        return  d.NumberOfBoys > d.NumberOfGirls ? 'Boys' : 'Girls';
    })

var girls_or_boys = schoolData.dimension(dc.pluck('EstablishmentName'));

    var girls_or_boys_group = girls_or_boys.group().reduce(addPupils, removePupils, initialisePupils);   

    var girls_or_boys_chart = dc.pieChart('#PieChart');

    girls_or_boys_chart /* dc.pieChart('#gain-loss-chart', 'chartGroup') 
        // (_optional_) define chart width, `default = 200`
        .width(180)
        // (optional) define chart height, `default = 200`
        .height(180)
        // Define pie radius
        .radius(80)
        // Set dimension
        .dimension(girls_or_boys)
        // Set group
        .group(girls_or_boys_group);

    dc.renderAll();
    // (_optional_) by default pie chart will use `group.key` as its label but you can overwrite it with a closure.
      .label(function (d) {
          if (gainOrLossChart.hasFilter() && !gainOrLossChart.hasFilter(d.key)) {
              return d.key + '(0%)';
          }
          var label = d.key;
          if (all.value()) {
              label += '(' + Math.floor(d.value / all.value() * 100) + '%)';
          }
          return label;
      })    
}
*/

