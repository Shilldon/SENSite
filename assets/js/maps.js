var map;
var markers = [];
var markerInfo = [];
//initialise arrays to hold data from master csv file and schools local to postcode search
//var masterSchoolsArray = [];
//var localSchoolsDataArray = [];

//retrieve postcode from input then search master array for schools matching postcode
function searchForSchool() {
  //get user input postcode
  //Two part post code enables users to input a partial postcode to find schools close to their area.
  //User's full postcode is unlikely to generate any results as their postcode is unlikely to match a school
  var postcodePart1 = $('#map-address-1').val();
  var postcodePart2 = $('#map-address-2').val();
  var postcode;
  postcode = postcodePart1 + " " + postcodePart2;
  postcode = postcode.toUpperCase();
  if (postcode != "") {
    queue()
      .defer(d3.csv, 'assets/data/schools.csv')
      .await(loadSchoolMapData);
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

  function loadSchoolMapData(error, schoolMapData) {
    ndx = crossfilter(schoolMapData);
    filterMapByPostcode(ndx);
  }

  //tidy up:
  //remove any existing markers on the map
  clearMarkers();
  //remove any existing data from the school information panel
  clearSchoolDetails();


}

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}

function filterMapByPostcode(schoolMapData, minCount, maxCount) {
  //get user submitted postcode

  var postcodePart1 = $('#map-address-1').val();
  var postcodePart2 = $('#map-address-2').val();
  var postcode = postcodePart1;
  if (postcodePart2 != "") {
    postcode = postcodePart1 + " " + postcodePart2;
  }
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
  var local_map_schools_dim = schoolMapData.dimension(function(d) {
    return {
      Postcode: d.Postcode,
      'EstablishmentStatus (code)': d['EstablishmentStatus (code)'],
    }

  })
  var count = 0;

  //filter dimension to exclude postcodes that do not partial match user submitted postcode
  //and schools that are closed
  local_map_schools_dim.filter(function(d) {
    if (checkPostcode(postcode, d.Postcode) == false || d['EstablishmentStatus (code)'] != 1) {
      return d;
    }
  });

  schoolMapData.remove();
  local_map_schools_dim.filter(null);

  //create array to receive postcodes from SchoolData dimension (filtered by postcode)
  var schoolPostCodesArray = []

  local_map_schools_dim.top(Infinity).forEach(function(x) {
    schoolPostCodesArray.push(x.Postcode);
  });

  convertPostcodes(local_map_schools_dim, schoolPostCodesArray)

}

function clearSchoolDetails() {
  $("#school-name").text("");
  $("#school-type").text("");
  $("#education-phase").text("");
  $("#school-website").html('');
  $("#school-telephone").text("");
  $("#school-head").text("");
  $("#school-rating").text("");
  $("p[id^='disability-icon']").css("color", "grey");
  $("p[id^='disability-icon']").css("background-color", "transparent");
}

//call external API and obtain lat, lng positions based on postcodes of schools
function getPostcodeData(schoolPostCodes, callback) {
  //call postcodes API to get postcode data
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://api.postcodes.io/postcodes");
  xhr.setRequestHeader("Content-Type", "application/json");
  var postcodes = JSON.stringify({ "postcodes": schoolPostCodes });
  xhr.send(postcodes);
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      callback(JSON.parse(this.responseText));
    }
  };
}

function convertPostcodes(local_map_schools_dim, schoolPostCodesArray) {
  //get longitude and latitude from postcode ready to place google map marker
  //import lat, lng positions from external API then create markers with requisite data
  //from the local_map_schools_dim array (name, address, education phase, school type, website, contact number, head teacher)
  var initialLong;
  var initialLat;
  schoolMarkerDataDim = local_map_schools_dim.top(Infinity);
  getPostcodeData(schoolPostCodesArray, function(data) {
    initialLat = data.result[0].result.latitude;
    initialLong = data.result[0].result.longitude;
    for (i = 0; i < schoolPostCodesArray.length; i++) {
      var latitude = data.result[i].result.latitude;
      var longitude = data.result[i].result.longitude;
      var schoolName = schoolMarkerDataDim[i].EstablishmentName;
      var schoolType = schoolMarkerDataDim[i]['TypeOfEstablishment (name)'].replace("Other ", "");
      schoolType = capitaliseFirstLetter(schoolType);
      var educationPhase = schoolMarkerDataDim[i]['PhaseOfEducation (name)'];
      educationPhase = educationPhase.replace("Not applicable", "");
      var schoolWebsite = schoolMarkerDataDim[i].SchoolWebsite;
      if (schoolWebsite != "") {
        if (schoolWebsite.match(/http/g) == null) {
          schoolWebsite = "http://" + schoolWebsite;
        }
      }
      var schoolTelephone = schoolMarkerDataDim[i].TelephoneNum;
      if (schoolTelephone > 0) { schoolTelephone = "Telephone: 0" + schoolTelephone; }
      var SEN = [];
      for (j = 1; j <= 13; j++) {
        SEN[j] = schoolMarkerDataDim[i]['SEN' + j + ' (name)'].substr(0, 2);
      }
      var schoolHead = schoolMarkerDataDim[i]['HeadTitle (name)'] + " " + schoolMarkerDataDim[i].HeadFirstName + " " + schoolMarkerDataDim[i].HeadLastName;
      var ofsted = schoolMarkerDataDim[i]['OfstedRating (name)'];
      if (ofsted != undefined) {
        ofsted = ofsted.toLowerCase();
      }
      rating = 0;
      switch (ofsted) {
        case "outstanding":
          rating = 4;
          break;
        case "good":
          rating = 3;
          break;
        case "requires improvement":
          rating = 2;
          break;
        case "special measures":
          rating = 1;
          break;
      }

      //export school data to markers, then draw on map
      markerInfo = [latitude, longitude, schoolName, schoolType, educationPhase, schoolWebsite, schoolTelephone, SEN, schoolHead, rating];
      drawMarker(markerInfo);
    }
    //center the map on the first school in area.
    map.setCenter(new google.maps.LatLng(initialLat, initialLong));
  });

}

//csv is inconsistent with naming of schools - this function ensures names, addresses etc are properly formatted with capital letters at the start.
function capitaliseFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

//initialise variable to check if previous map marker as been clicked on and opened.
var previousInfoWindow = false;

//draw marker on map and display school information on information panel
function drawMarker(markerInfo) {
  //locate marker based on lat lng taken from external API using postcode
  var schoolPosition = new google.maps.LatLng(markerInfo[0], markerInfo[1]);
  //add data to marker
  var marker = new google.maps.Marker({
    position: schoolPosition,
    title: markerInfo[2],
    icon: 'assets/images/purple-pushpin.png',
    type: markerInfo[3],
    educationPhase: markerInfo[4],
    schoolWebsite: markerInfo[5],
    schoolTelephone: markerInfo[6],
    SEN: markerInfo[7],
    schoolHead: markerInfo[8],
    offstedRating: markerInfo[9]
  });
  //display school information on marker
  var infoContent = '<div id="content"><h5>' + marker.title + '</h5>';

  if ($(window).width() < 767) {
    if (marker.schoolWebsite != "") {
      infoContent = '<div id="content"><h5><a href=' + marker.schoolWebsite + ' target="_blank">' + marker.title + '</a></h5>'
    }
    infoContent += '<p>' + marker.schoolTelephone + '</p>';
    if (rating > 0) {
      infoContent += '<p>Offsted Rating:</p>';
      infoContent += '<p><img class="map--marker-stars" src="assets/images/rating-' + rating + '.png"</p>';
    }
  }
  var infowindow = new google.maps.InfoWindow({
    content: infoContent,

  });

  //functionality to detect click on marker, if so dsplay school information
  marker.addListener('click', function() {
    //check if previous infowindow is open and, if so, close it
    if (previousInfoWindow) {
      previousInfoWindow.close();
    }
    //reinitilise school information panel
    clearSchoolDetails();
    previousInfoWindow = infowindow;
    infowindow.open(map, marker);

    //get data from marker and display in school information panel.
    $("#school-name").text(marker.title);
    $("#school-type").text("Type of school: " + marker.type);
    if (marker.educationPhase != "") { $("#education-phase").text("Education level: " + marker.educationPhase); }
    if (marker.schoolWebsite != "") {
      $("#school-website").html('<a href=' + marker.schoolWebsite + ' target="_blank">Go to website</a>');
    }
    if (marker.schoolHead != "") { $("#school-head").text("Head: " + marker.schoolHead); }
    if (marker.schoolTelephone != "") { $("#school-telephone").text(marker.schoolTelephone); }
    if (marker.offstedRating > 0) {
      $("#school-rating").html('<p>Offsted Rating: <img class="map--marker-stars" style="width:20%" src="assets/images/rating-' + marker.offstedRating + '.png"</p>');
      $("#school-rating").css('display', 'inline-block');
    }
    else { $("#school-rating").css('display', 'none'); }
    var icon;
    //check special needs catered for at school, highlight appropriate icons
    for (i = 0; i < 13; i++) {
      switch (marker.SEN[i]) {
        case "AS":
          icon = "#disability-icon-ASD"
          break;
        case "Sp":
          icon = "#disability-icon-SLD";
          break;
        case "ML":
          icon = "#disability-icon-LD";
          break;
        case "SL":
          icon = "#disability-icon-LD";
          break;
        case "PM":
          icon = "#disability-icon-LD";
          break;
        case "PD":
          icon = "#disability-icon-PD";
          break;
        case "SE":
          icon = "#disability-icon-SEMH";
          break;
        case "HI":
          icon = "#disability-icon-HI";
          break;
        case "VI":
          icon = "#disability-icon-VI";
          break;
        case "SL":
          icon = "#disability-icon-SLC";
          break;
      }
      colourInIcon(icon);
    }
  });

  markers.push(marker);
  marker.setMap(map);
}

//change color of icon to display providing information on SEN
function colourInIcon(icon) {
  $(icon).css({
    'transition-duration': '1s',
    'color': '#e1e1e1',
    'background-color': '#9c6df9'
  });
}

//initialise map to starting location
function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 51.401672, lng: -1.324373 },
    zoom: 13,
    disableDefaultUI: true,
    styles: [
      { elementType: 'geometry', styles: [{ color: '#6d23ff' }] }
    ]
  });
}

$("#map-submit").click(function() {
  searchForSchool();
});

$('#map-address-1').keypress(function(e) {
  if (e.keyCode == 13)
    $('#map-address-2').focus();
});
$('#map-address-2').keypress(function(e) {
  if (e.keyCode == 13)
    $('#map-submit').focus();
  searchForSchool();
});
