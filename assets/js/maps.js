var map;
var markers = [];
var markerInfo = [];
//initialise arrays to hold data from master csv file and schools local to postcode search
var masterSchoolsArray = [];
//var localSchoolsDataArray = [];

//once loaded get the data from local csv and process into master array
$(document).ready(function() {
  $.ajax({
    type: "GET",
    url: "assets/data/schools.csv",
    dataType: "text",
    success: function(data) { createSchoolsArray(data); }
  });
});

function createSchoolsArray(allText) {
  //create master array of schools from local csv file
  var allTextLines = allText.split(/\r\n|\n/);
  var headers = allTextLines[0].split(',');
  var schoolsDataArray = [];

  //cycle through all lines of text and push data to master array
  for (var i = 0; i < allTextLines.length; i++) {
    var data = allTextLines[i].split(',');
    if (data.length == headers.length) {
      var schoolArray = [];
      for (var j = 0; j < headers.length; j++) {
        schoolArray.push(data[j]);
      }
      masterSchoolsArray.push(schoolArray);
    }
  }
}

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

  //tidy up:
  //remove any existing markers on the map
  clearMarkers();
  //remove any existing data from the school information panel
  clearSchoolDetails();

  //call function to create array of local schools
  var localSchoolsDataArray = createLocalSchoolsArray(postcode);

  //check if there are any schools in the array. If not return error that there
  //are no schools in the selected postcode.
  //If the array contains school data convert postcodes to lat, lng positions to display on map
  if (localSchoolsDataArray.length > 0) {
    convertPostcodes(localSchoolsDataArray);
  }
  else {
    $("#school-name").text("No schools found in postcode " + postcode);
  }
}

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}

function clearSchoolDetails() {
  $("#school-name").text("");
  $("#school-type").text("");
  $("#education-phase").text("");
  $("#school-website").html('');
  $("#school-telephone").text("");
  $("p[id^='disability-icon']").css("color", "grey");
  $("p[id^='disability-icon']").css("background-color", "transparent");
}

function createLocalSchoolsArray(postcode) {
  //reinitialise the localSchoolsDataArray to receive new postcode
  var localSchoolsDataArray = [];
  var schoolsDataArray = [];
  //search through masterSchoolsArray for postcodes matching input
  for (var j = 0; j < masterSchoolsArray.length; j++) {
    schoolPostcode = masterSchoolsArray[j][64];

    //check if the school is marked as closed, if so do not retrieve to local school array
    //ensure header row is added (j=0)
    schoolClosed = masterSchoolsArray[j][10];
    if (schoolClosed != "Closed") {
      if (j==0 || schoolPostcode.search(postcode) != -1) {
        schoolsDataArray.push(masterSchoolsArray[j]);
      }
    }
  }
  return schoolsDataArray;
}

//call external API and obtain lat, lng positions based on postcodes of schools
function getPostcodeData(schoolPostCodes, callBack) {
  //call postcodes API to get postcode data
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://api.postcodes.io/postcodes");
  xhr.setRequestHeader("Content-Type", "application/json");
  var postcodes = JSON.stringify({ "postcodes": schoolPostCodes });
  xhr.send(postcodes);
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      callBack(JSON.parse(this.responseText));
    }
  };
}

function convertPostcodes(localSchoolsDataArray) {
  //get longitude and latitude from postcode ready to place google map marker
  //initialise array to accept postcodes of the local schools
  //NB start for loop at 1 to skip header tow
  var schoolPostCodesArray = []
  for (i = 1; i < localSchoolsDataArray.length; i++) {
    var schoolPostCode = localSchoolsDataArray[i][64];
    schoolPostCodesArray.push(schoolPostCode);
  }
  //import lat, lng positions from external API then create markers with requisite data
  //from the localSchoolData array (name, address, education phase, school type, website, contact number, head teacher)
  getPostcodeData(schoolPostCodesArray, function(data) {
    for (i = 0; i < localSchoolsDataArray.length; i++) {
      if (data.result[i].result != null) {
        //get school information data and assign it to marker.
        var latitude = data.result[i].result.latitude;
        var longitude = data.result[i].result.longitude;
        var schoolName = localSchoolsDataArray[i][4];
        var schoolType = localSchoolsDataArray[i][6].replace("Other ", "");
        schoolType = capitaliseFirstLetter(schoolType);
        var educationPhase = localSchoolsDataArray[i][18];
        educationPhase = educationPhase.replace("Not applicable", "");
        var schoolWebsite = localSchoolsDataArray[i][65];

        //csv is inconsistent at providing full webaddress - to ensure link on marker works add "http:" if required.
        if (schoolWebsite != "") {
          if (schoolWebsite.match(/http/g) == null) {
            schoolWebsite = "http://" + schoolWebsite;
          }
        }

        var schoolTelephone = localSchoolsDataArray[i][66];
        if (schoolTelephone > 0) { schoolTelephone = "Telephone: 0" + schoolTelephone; }
        var SEN = [];
        for (j = 0; j < 13; j++) {
          SEN[j] = localSchoolsDataArray[i][j + 84].substr(0, 2);
        }
        var schoolHead = localSchoolsDataArray[i][67] + " " + localSchoolsDataArray[i][68] + " " + localSchoolsDataArray[i][69]
        var offsted = localSchoolsDataArray[i][126];
        offsted = offsted.toLowerCase();
        rating = 0;
        switch (offsted) {
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
    }
    //center the map on the first school in area.
    centerMap(localSchoolsDataArray[0][64]);
  });
}

function centerMap(postcode) {
  //take address from postcode of first school in area and center map
  var geocoder = new google.maps.Geocoder();
  var address = postcode;
  geocoder.geocode({ 'address': address }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      lat = results[0].geometry.location.lat();
      long = results[0].geometry.location.lng();
      /*     var marker = new google.maps.Marker({
             position: { lat: lat, lng: long },
             map: map
           })*/
      map.setCenter(new google.maps.LatLng(lat, long));
    }
    else {
      alert("Cannot centre on local school - invalid postcode from database.")
    }
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
  $(icon).css("color", "#e1e1e1");
  $(icon).css("background-color", "#9c6df9");
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
