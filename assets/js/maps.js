$(document).ready(function() {

  $("#map-submit").click(function() {
    clearMarkers();
    getSchoolsData();
  });

  $('#map-address-1').keypress(function(e) {
    if (e.keyCode == 13)
      $('#map-address-2').focus();
  });
  $('#map-address-2').keypress(function(e) {
    if (e.keyCode == 13)
      $('#map-submit').focus();
    clearMarkers();
    //getSchoolsData();
  });
});

var map;
var markers = [];
var markerInfo = [];

function getSchoolsData() {
  //get local csv database of schools
  $(document).ready(function() {
    $.ajax({
      type: "GET",
      url: "assets/data/schoolsshort.csv",
      dataType: "text",
      success: function(data) { createLocalSchoolsArray(data); }
    });
  });
}

function clearSchoolDetails() {
  $("#school-name").text("");
  $("#school-type").text("");
  $("#education-phase").text("");
  $("#school-website").html('');
  $("#school-telephone").text("");
}

function centerMap(postcode) {
  var geocoder = new google.maps.Geocoder();
  var address = postcode;
  geocoder.geocode({ 'address': address }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      lat = results[0].geometry.location.lat();
      long = results[0].geometry.location.lng();
      var marker = new google.maps.Marker({
        position: { lat: lat, lng: long },
        map: map
      })
      map.setCenter(new google.maps.LatLng(lat, long));
    }
    else {
      alert("Request failed.")
    }
  });

}

function createLocalSchoolsArray(allText) {
  //get user input postcode
  var postcodePart1 = $('#map-address-1').val();
  var postcodePart2 = $('#map-address-2').val();
  var postcode = postcodePart1 + " " + postcodePart2;
  postcode = postcode.toUpperCase();

  var allTextLines = allText.split(/\r\n|\n/);
  var headers = allTextLines[0].split(',');
  var schoolsDataArray = [];

  //compare postcode to schools in local database
  //create array of schools matching postcode
  for (var i = 1; i < allTextLines.length; i++) {
    var data = allTextLines[i].split(',');
    if (data.length == headers.length) {
      var schoolArray = [];

      //remove space in postcode
      schoolPostcode = data[64];
      schoolClosed = data[10];
      if (schoolClosed != "Closed") {
        if (schoolPostcode.search(postcode) != -1) {
          for (var j = 0; j < headers.length; j++) {
            schoolArray.push(data[j]);
          }
          schoolsDataArray.push(schoolArray);
        }
      }
    }
  }
  //check if there are any schools in the array. If not return error that there
  //are no schools in the selected postcode.
  clearSchoolDetails();
  if (schoolsDataArray.length > 0) {
    convertPostcodes(schoolsDataArray);
  }
  else {
    $("#school-name").text("No schools found in postcode " + postcode);
  }

  centerMap(postcode);
}

function capitaliseFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function convertPostcodes(schoolsDataArray) {
  //get longitude and latitude from postcode ready to place google map marker
  var schoolPostCodesArray = []
  for (i = 0; i < schoolsDataArray.length; i++) {
    var schoolPostCode = schoolsDataArray[i][64];
    schoolPostCodesArray.push(schoolPostCode);
  }

  getPostcodeData(schoolPostCodesArray, function(data) {
    for (i = 0; i < schoolsDataArray.length; i++) {
      if (data.result[i].result != null) {
        //get school information data and assign it to marker.
        var latitude = data.result[i].result.latitude;
        var longitude = data.result[i].result.longitude;
        var schoolName = schoolsDataArray[i][4];
        var schoolType = schoolsDataArray[i][6].replace("Other ", "");
        schoolType = capitaliseFirstLetter(schoolType);
        var educationPhase = schoolsDataArray[i][18];
        educationPhase = educationPhase.replace("Not applicable", "");
        var schoolWebsite = schoolsDataArray[i][65];
        if (schoolWebsite != "") {
          if (schoolWebsite.match(/http/g) == null || schoolWebsite.match(/https/g) == null) {
            schoolWebsite = "http://" + schoolWebsite;
          }
        }
        var schoolTelephone = schoolsDataArray[i][66];
        if (schoolTelephone > 0) { schoolTelephone = "0" + schoolTelephone; }
        markerInfo = [latitude, longitude, schoolName, schoolType, educationPhase, schoolWebsite, schoolTelephone];
        drawMarker(markerInfo);
      }
    }
  });
}

function getPostcodeData(schoolPostCodes, callBack) {
  //call postcodes API to get postcode data
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://api.postcodes.io/postcodes");
  xhr.setRequestHeader("Content-Type", "application/json");
  var postcodes = JSON.stringify({ "postcodes": schoolPostCodes });
  console.log(postcodes)
  xhr.send(postcodes);
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      callBack(JSON.parse(this.responseText));
    }
  };
}

var previousInfoWindow = false;

function drawMarker(markerInfo) {
  var schoolPosition = new google.maps.LatLng(markerInfo[0], markerInfo[1]);

  var marker = new google.maps.Marker({
    position: schoolPosition,
    title: markerInfo[2],
    icon: 'assets/images/purple-pushpin.png',
    type: markerInfo[3],
    educationPhase: markerInfo[4],
    schoolWebsite: markerInfo[5],
    schoolTelephone: markerInfo[6]
  });


  var infowindow = new google.maps.InfoWindow({
    content: marker.title
  });
  marker.addListener('click', function() {
    //check if previous infowindow is open and, if so, close it
    if (previousInfoWindow) {
      previousInfoWindow.close();
    }
    previousInfoWindow = infowindow;
    infowindow.open(map, marker);

    //get data from marker and display in window.
    $("#school-name").text(marker.title);
    $("#school-type").text("Type of school: "+marker.type);
    if(marker.educationPhase !="") { $("#education-phase").text("Education level: "+marker.educationPhase); }
    if (marker.schoolWebsite != "") {
      $("#school-website").html('<a href=' + marker.schoolWebsite + ' target="_blank">Go to website</a>');
    }
    else {
      $("#school-website").html('');
    }
    if (marker.schoolTelephone != "") { $("#school-telephone").text(marker.schoolTelephone); }

  });

  markers.push(marker);
  marker.setMap(map);
}

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}


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
