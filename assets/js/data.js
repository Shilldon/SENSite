$('#button-chart-plot-previous').on("click", function() {
    var min = parseInt($('#button-chart-plot-previous').attr('min'));
    min = min - 25;
    $('#button-chart-plot-previous').attr('min', parseInt(min));
    var max = parseInt($('#button-chart-plot-next').attr('max'));
    max = max - 25;
    $('#button-chart-plot-next').attr('max', parseInt(max));
    defineChartData();
    //   retrievePostcodeData(ndx,min,max)
})

$('#button-chart-plot-next').on("click", function() {
    var min = parseInt($('#button-chart-plot-previous').attr('min'));
    min += 25;
    $('#button-chart-plot-previous').attr('min', parseInt(min));
    var max = parseInt($('#button-chart-plot-next').attr('max'));
    max += 25;
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
var scale;
var dataset = [0];

//load in csv of schools into schoolData crossfilter
function defineChartData() {
    queue()
        .defer(d3.csv, 'assets/data/schoolsshort.csv')
        .await(loadData);
    barChartWidth = $(".data-tab--chart :visible").first().width();
    console.log($(".data-tab--chart").first())
    console.log(barChartWidth)
    barChartHeight = $(".data-tab--chart :visible").first().height();

    function loadData(error, schoolData) {
        ndx = crossfilter(schoolData);
        console.log("national display: " + $("#data-tab--chart-national-tab").css('display'))
        console.log("regional display: " + $("#data-tab--chart-regional-tab").css('display'))
        if ($("#data-tab--chart-national-tab").css('display') == 'none') {
            filterByPostcode(ndx, 0, 0);
        }
        else {
            renderNationalChart(ndx)
        }
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

    console.log("max=" + maxCount + " min=" + minCount)

    var postcodePart1 = $('#chart-address-1').val();
    var postcodePart2 = $('#chart-address-2').val();
    var postcode;
    postcode = postcodePart1 + " " + postcodePart2;
    postcode = postcode.toUpperCase();

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
    var count = 1;

    /*   dimData = local_schools_dim.top(Infinity);
       i=0;
       dimData.forEach(function (x) {
           i++;
           console.log(i+" "+JSON.stringify(x.EstablishmentName));
       });
       */

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
            count++;
            //         console.log(count)
        }
    });
    schoolData.remove();
    local_schools_dim.filter(null);

    if (count > maxCount) {
        console.log("count more than max")
        $("#button-chart-plot-next").show();
    }
    else {
        console.log("count less than max")
        $("#button-chart-plot-next").hide();
    }
    if (minCount >= 25) {
        console.log("mincount more than 25")
        $("#button-chart-plot-previous").show();
    }
    else {
        console.log("mincount less than 25")

        $("#button-chart-plot-previous").hide();
    }

    new_schools_dim = schoolData.dimension(dc.pluck('EstablishmentName'));
    /*dimData = new_schools_dim.top(Infinity);
        dimData.forEach(function (x) {
            console.log(JSON.stringify(x));
        });    */


    //render charts
    renderOfstedSelector(schoolData, postcode);
    renderSENSelector(schoolData, postcode);
    //    renderPieChart(schoolData);
    renderRegionalChart(new_schools_dim);
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
                console.log(SEN)
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
function renderRegionalChart(schools_dim) {
    console.log("rendering regional chart");

    function addSchool(p, v) {
        //      p.count++;
        // console.log(p.count)
        p.capacity += parseInt(v.SchoolCapacity) - parseInt(v.NumberOfBoys) - parseInt(v.NumberOfGirls);
        if (p.capacity < 0) {
            p.capacity = 0;
        }
        //    console.log("added "+v.EstablishmentName+" "+p.capacity)
        //      console.log("remove "+v['EstablishmentTypeGroup (name)']+" total "+p.total);
        return p;
    }

    function removeSchool(p, v) {
        //     p.count--;
        //    if (p.count == 0) {
        //        p.capacity = 0;
        //    }
        //    else {
        p.capacity += parseInt(v.SchoolCapacity) - parseInt(v.NumberOfBoys) - parseInt(v.NumberOfGirls);
        if (p.capacity < 0) {
            p.capacity = 0;
        }
        //    }
        //     console.log("remove "+v['EstablishmentTypeGroup (name)']+" total "+p.total);
        //   console.log("removed "+v.EstablishmentName+" "+p.capacity)
        return p;
    }

    function initialiseSchool() {
        return { /*count:0,*/ capacity: 0 };
    }

    var boy_pupils_per_school = schools_dim.group().reduceSum(dc.pluck('NumberOfBoys'));
    var girl_pupils_per_school = schools_dim.group().reduceSum(dc.pluck('NumberOfGirls'));
    //   var school_capacity=schools_dim.group().reduceSum(dc.pluck('SchoolCapacity'));

    var school_capacity = schools_dim.group().reduceSum(function(d) {

        //     console.log(i+" "+d.EstablishmentName+" capacity="+d.SchoolCapacity+"!");
        if (d.SchoolCapacity == "") {
            //            console.log("not a number calculate capacity")
            d.SchoolCapacity = parseInt(d.NumberOfGirls) + parseInt(d.NumberOfBoys);
        }
        else {
            d.SchoolCapacity = parseInt(d.SchoolCapacity);
        }
        //        console.log(d.EstablishmentName+" capacity="+capacity);
        return d.SchoolCapacity;
    });

    var reduced_school_capacity = schools_dim.group().reduce(addSchool, removeSchool, initialiseSchool);

    var numberOfPupilsChart = dc.barChart('#data-tab--chart-regional');

    if ($('#select-total-pupils').is(':checked')) {
        console.log("barChartHeight" + barChartHeight)
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
            .on('renderlet', function(numberOfPupilsChart) {
                    numberOfPupilsChart.selectAll('g.x text')
                        .attr('transform', 'translate(-12.5,-120) rotate(270)');
                    /*      console.log("barChartHeight=" + barChartHeight)
                          numberOfPupilsChart.selectAll('rect.bar')
                              .attr('width', function(d) {
                                  currentBarWidth = $("rect.bar").attr('width');
                                  if (d.layer == "Boys") {
                                      return currentBarWidth * 1;
                                  }
                                  else if (d.layer == "Girls") {
                                      return currentBarWidth * 0.75;
                                  }
                                  else if (d.layer == "Remaining Spaces") {
                                      return currentBarWidth * 0.5;
                                  }
                              })*/
                    numberOfPupilsChart.selectAll('g.tick line')
                    .on("mouseover", console.log("moused over"))
                    .attr('fill','black')
                        .attr('full-name', function(d) { return d })
                        .attr('short-name', function(d) {
                            if (d.length > 30) {
                                return d.substr(0, 30) + '...';
                            }
                        })
                            .on("mouseover", function(d) { $(this).siblings().text($(this).attr('full-name'))})
                            .on("mouseout", function(d) { $(this).siblings().text($(this).attr('short-name'))})

                            numberOfPupilsChart.selectAll('rect.bar title')
                                .text(function(d) {
                                    //                 console.log(JSON.stringify(d)); 
                                    console.log("layer=" + d.layer);
                                    //                console.log("d.data.value = "+d.data.value); 
                                    if (d.layer != "Remaining Spaces") {
                                        return d.x + ": " + d.data.value
                                    }
                                    else {
                                        return d.x + ": " + d.data.value.capacity

                                    }

                                });

                            numberOfPupilsChart.selectAll('g.x text')
                                .text(function(d) {
                                    if (d.length > 30) {
                                        return d.substr(0, 30) + '...';
                                    }
                                    else {
                                        return d;
                                    }
                                });

                        })

                        .yAxisLabel("Number of Pupils")
                        .yAxis().ticks(20);
                }
                else if ($('#select-school-capacity').is(':checked')) {
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
                        .on('renderlet', function(numberOfPupilsChart) {
                            numberOfPupilsChart.selectAll('g.x text')
                                .attr('transform', 'translate(-12.5,-120) rotate(270)');
                        })
                        .yAxisLabel("Number of Pupils")
                        .yAxis().ticks(20);
                }
                dc.renderAll();
            }

        function renderNationalChart(schoolData) {
            console.log("rendering national chart");

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
            //var school_capacity = schools_dim.group().reduceSum(dc.pluck('SchoolCapacity'));

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
                        .attr('transform', 'translate(-12.5,0) rotate(315)')
                }))
                .xUnits(dc.units.ordinal)
                .elasticY(true)
                .yAxisLabel("Number of Establishments")
                .yAxis().ticks(20);

            /*   var establishmentChart = dc.rowChart('#data-tab--chart-national');
               
               establishmentChart
                      .width(barChartWidth)
                      .height(barChartHeight)
                      .x(d3.scale.linear().domain([0,1000]))
                      .elasticX(true)
                      .dimension(establishment_dim)
                      .group(establishment_categories);*/

            dc.renderAll();
        }

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

        function wrap(text, width) {
            console.log("called wrap text")
            text.each(function() {
                var text = d3.select(this),
                    words = text.text().split(/\s+/).reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.1, // ems
                    y = text.attr("y"),
                    dy = parseFloat(text.attr("dy")),
                    tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
                while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join(" "));
                        line = [word];
                        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                    }
                }
            });
        }
