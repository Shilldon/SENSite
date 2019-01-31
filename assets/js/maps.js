$("#submit").click(function() {
  clearMarkers();
  getSchoolsData();
});

var map;
var markers = [];

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

function createLocalSchoolsArray(allText) {
  //get user input postcode
  var postcode = document.getElementById('map-address').value;
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
      schoolPostcode = data[64].replace(" ", "");
      if (schoolPostcode.search(postcode) != -1) {
        for (var j = 0; j < headers.length; j++) {
          schoolArray.push(data[j]);
        }
        schoolsDataArray.push(schoolArray);
      }
    }
  }
  //check if there are any schools in the array. If not return error that there
  //are no schools in the selected postcode.
  if (schoolsDataArray.length > 0) {
    convertPostcodes(schoolsDataArray);
  }
  else {
    document.getElementById("school-name").innerHTML = "No schools found in postcode " + postcode;
  }
}

function convertPostcodes(schoolsDataArray) {
  //get longitude and latitude from postcode ready to place google map marker
  var schoolPostCodesArray = []
  for (i = 0; i < schoolsDataArray.length; i++) {
    var schoolPostCode = schoolsDataArray[i][64];
    schoolPostCode = schoolPostCode.replace("Postcode:", "");
    schoolPostCodesArray.push(schoolPostCode);
  }
  getPostcodeData(schoolPostCodesArray, function(data) {
    for (i = 0; i < schoolsDataArray.length; i++) {
      if (data.result[i].result != null) {
        //Need to create long/lat array for google map markers
        var schoolName = schoolsDataArray[i][4];
        schoolName = schoolName.replace("EstablishmentName:", "");
        var schoolType=schoolsDataArray[i][6];
        var latitude = data.result[i].result.latitude;
        var longitude = data.result[i].result.longitude;
        drawMarker(latitude, longitude, schoolName, schoolType);
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
  xhr.send(postcodes);

  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      callBack(JSON.parse(this.responseText));
    }
  };
}
  var previousInfoWindow = false;

function drawMarker(latitude, longitude, schoolName, schoolType) {
  var schoolPosition = new google.maps.LatLng(latitude, longitude);

  var marker = new google.maps.Marker({
    position: schoolPosition,
    title: schoolName,
    icon: 'assets/images/purple-pushpin.png',
    type: schoolType
  });
  
  
    var infowindow = new google.maps.InfoWindow({
    content: marker.title
  });
  marker.addListener('click', function () {


  console.log(marker.title);
  console.log(marker.type)
    if (previousInfoWindow) {
      previousInfoWindow.close();
    }
    previousInfoWindow = infowindow;
    infowindow.open(map, marker);
    $("#school-name").text(marker.title);
    $("#school-type").text(marker.type);
    
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
