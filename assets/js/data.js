$('#button-chart-plot-previous').on("click", function() {
    var min=parseInt($('#button-chart-plot-previous').attr('min'));
    min=min-25;
    $('#button-chart-plot-previous').attr('min',parseInt(min));
    var max=parseInt($('#button-chart-plot-next').attr('max'));
    max=max-25;
    $('#button-chart-plot-next').attr('max',parseInt(max));
    defineChartData();
 //   retrievePostcodeData(ndx,min,max)
})

$('#button-chart-plot-next').on("click", function() {
    var min=parseInt($('#button-chart-plot-previous').attr('min'));
    min+=25;
    $('#button-chart-plot-previous').attr('min',parseInt(min));
    var max=parseInt($('#button-chart-plot-next').attr('max'));
    max+=25;
    $('#button-chart-plot-next').attr('max',parseInt(max));
        defineChartData();
 //   retrievePostcodeData(ndx,min,max)
})

var ndx;
var chart;
var colWidth;
var barWidth;
var chartWidth = $("#data-tab--chart-regional").width();
var chartHeight = $("#data-tab--chart-regional").height();
var scale;
var dataset = [0];

chart = d3.select("#data-tab--chart-regional")
    .append("svg")
    .attr("height", chartHeight)
    .attr("width", chartWidth);

//load in csv of schools into schoolData crossfilter
function defineChartData() {
    queue()
        .defer(d3.csv, 'assets/data/schoolsshort.csv')
        .await(loadData);

    function loadData(error, schoolData) {
        ndx = crossfilter(schoolData);
        retrievePostcodeData(ndx,0,0);
    }
}

function print_filter(filter) {
    var f=eval(filter);
    if (typeof(f.length) != "undefined") {}else{}
    if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
    if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
    console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
}

//check user submitted postcode and filter schoolData based on postcode submitted
function retrievePostcodeData(schoolData, minCount, maxCount) {
 //   print_filter(schoolData);
    //get user submitted postcode
    minCount=$('#button-chart-plot-previous').attr('min');
    maxCount=$('#button-chart-plot-next').attr('max'); 
    
    console.log("max="+maxCount+" min="+minCount)
    
    var postcodePart1 = $('#chart-address-1').val();
    var postcodePart2 = $('#chart-address-2').val();
    var postcode;
    postcode = postcodePart1 + " " + postcodePart2;
    postcode = postcode.toUpperCase();

    //create dimension of multiple arrays for filtering
    local_schools_dim=schoolData.dimension(function(d) {
        return { Postcode: d.Postcode,
                 'EstablishmentStatus (code)': d['EstablishmentStatus (code)'],
                 EstablishmentName: d.EstablishmentName,
                 NumberOfPupils: d.NumberOfPupils,
                 NumberOfBoys: d.NumberOfBoys,
                 NumberOfGirls: d.NumberOfGirls,
                 SchoolCapacity: d.SchoolCapacity
        }
        
    })
    var count=1;

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
        if (checkPostcode(postcode, d.Postcode) == false || d['EstablishmentStatus (code)']!=1 || (d.NumberOfBoys+d.NumberOfGirls==0)) {
            return d;
        }
        else if(count<minCount || count>maxCount) {
            count++;
            return d;
        }
        else {
            count++;
            console.log(count)
        }
    });
    schoolData.remove();    
    local_schools_dim.filter(null);
    
    if(count>maxCount) {
        console.log("count more than max")
        $("#button-chart-plot-next").show();
    }
    else {
        console.log("count less than max")
        $("#button-chart-plot-next").hide();        
    }
    if(minCount>=25) {
        console.log("mincount more than 25")
        $("#button-chart-plot-previous").show();
    }
    else {
        console.log("mincount less than 25")
        
        $("#button-chart-plot-previous").hide();        
    }    
  /*  var dimData = local_schools_dim.top(Infinity);
    dimData.forEach(function (x) {
        console.log(JSON.stringify(x));
    });*/
        
/*
    local_schools_dim = schoolData.dimension(dc.pluck('NumberOfPupils'));

    //filter dimension to exclude postcodes that do not partial match user submitted postcode
    local_schools_dim.filter(function(d) {
        console.log(d);
        if(d==0)
        {
            return d;
        }
    }  );


    schoolData.remove();*/
   // local_schools_dim.filter(null);
 //   open_schools_dim.filter(null);
    
  /*  dimData = local_schools_dim.top(Infinity);
    dimData.forEach(function (x) {
        console.log(JSON.stringify(x));
    });*/
    
 
    //create new dimension from EstablishmentName column, based on postcode filter
 /*   local_schools_dim = local_schools_dim.filter(function(d) {
        console.log(JSON.stringify(d['EstablishmentStatus (name)']));
        if(d['EstablishmentStatus (code)']!=1) {
            return d;
        }
    });
    schoolData.remove();
    local_schools_dim.filter(null);*/
    new_schools_dim= schoolData.dimension(dc.pluck('EstablishmentName'));
/*dimData = new_schools_dim.top(Infinity);
    dimData.forEach(function (x) {
        console.log(JSON.stringify(x));
    });    */
    
    
    //render charts
    renderSelector(schoolData, postcode);
    renderSelectorTwo(schoolData, postcode);
    renderPupilsChart(new_schools_dim);
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
function renderSelector(schoolData, postcode) {
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
function renderSelectorTwo(schoolData, postcode) {
    var SEN_dim = schoolData.dimension(function(d) {
        //filter out postcodes
        //loop needed as 13 columns for different types of SEN classes offered.
        for (i = 1; i <= 13; i++) {
            if (checkPostcode(postcode, d.Postcode)) {
                //only return d if postcode and SEN class are correct
                return d['SEN' + i + ' (name)'];
            }
        }
    })
    var SENSelector = SEN_dim.group();
    dc.selectMenu("#data-tab--chart-selector2-regional")
        .dimension(SEN_dim)
        .group(SENSelector);
}

//draw chart of number of pupils per school
function renderPupilsChart(schools_dim) {

    //?not to be implemented?
    //function to determine the total capacity of the school - however many entries in the csv indicate that school is over capacity or data is not provided.
    function add_item(p, v) {
        p.count++;
        //convert data into appropiate format
        if (v.SchoolCapacity == "") {
            p.capacity = parseInt(v.NumberOfBoys) + parseInt(v.NumberOfGirls);
        }
        else {
            p.capacity = parseInt(v.SchoolCapacity) - parseInt(v.NumberOfBoys) - parseInt(v.NumberOfGirls);

        }
        if (!p.capacity || p.capacity < 0) {
            console.log("found null")
            p.capacity = 0;
        }
        // console.log(v.EstablishmentName+" "+JSON.stringify(p));
        return p;

    }

    function remove_item(p, v) {
        p.count--;
        if (v.SchoolCapacity == "") {
            p.capacity = parseInt(v.NumberOfBoys) + parseInt(v.NumberOfGirls);
        }
        else {
            p.capacity = parseInt(v.SchoolCapacity) - parseInt(v.NumberOfBoys) - parseInt(v.NumberOfGirls);

        }
        if (!p.capacity || p.capacity < 0) {
            console.log("found null")
            p.capacity = 0;
        }
        return p;
    }

    function initialise() {
        return { count: 0, capacity: 0 };
    }


    var boy_pupils_per_school = schools_dim.group().reduceSum(dc.pluck('NumberOfBoys'));
    var girl_pupils_per_school = schools_dim.group().reduceSum(dc.pluck('NumberOfGirls'));
    var school_capacity = schools_dim.group().reduceSum(dc.pluck('SchoolCapacity'));

    var numberOfPupilsChart = dc.barChart('#data-tab--chart-regional');
if($('#select-total-pupils').is(':checked')) {
     numberOfPupilsChart
        .width(chartWidth)
        .height(chartHeight)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(schools_dim)
        .group(boy_pupils_per_school, "Boys")
        .stack(girl_pupils_per_school, "Girls")
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xAxisLabel("School")
        .xUnits(dc.units.ordinal)
        .legend(dc.legend().x(420).y(0).itemHeight(15).gap(5))
        .elasticY(true)
        .renderlet(function(numberOfPupilsChart) {
            numberOfPupilsChart.selectAll('g.x text')
                .attr('transform', 'translate(-12.5,-120) rotate(270)');
        })
        .yAxisLabel("Number of Pupils")
        .yAxis().ticks(20);
}
else if ($('#select-school-capacity').is(':checked')) {
    numberOfPupilsChart
        .width(chartWidth)
        .height(chartHeight)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(schools_dim)
        .group(school_capacity, "Total Capacity")
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xAxisLabel("School")
        .xUnits(dc.units.ordinal)
        .legend(dc.legend().x(420).y(0).itemHeight(15).gap(5))
        .elasticY(true)
        .renderlet(function(numberOfPupilsChart) {
            numberOfPupilsChart.selectAll('g.x text')
                .attr('transform', 'translate(-12.5,-120) rotate(270)');
        })
        .yAxisLabel("Number of Pupils")
        .yAxis().ticks(20);    
}
    dc.renderAll();
        
}
