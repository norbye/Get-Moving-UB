
var map;
var center = {lat: Number(coordinates.split(',')[0].trim()), lng: Number(coordinates.split(',')[1].trim())};
var zoom = 14;

function initMap() {
    var mapOptions = {
      zoom: zoom,
      center: center,
      mapTypeId: 'hybrid'
    };
    map = new google.maps.Map(document.getElementById('map'),
        mapOptions);
    
    //Load markers
    for(var i = 0; i < markers.length; i++){
        addMarker(i, markers[i]);
    }
}

/*
 * Center the map around the user
 */

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position){
        //position.coords.latitude
        //position.coords.longitude
        if(map == null){
            center = {lat: position.coords.latitude, lng: position.coords.longitude};
            zoom = 15;
        }else{
            map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
            map.setZoom(15);
        }
    });
} else {
    // = "Geolocation is not supported by this browser.";
}

/*
 * Map markers
 */

var iconBase = static_url + 'imgs/map/';
var icons = {
    normal: iconBase + 'pin v2.min.png'
};

var infoWindows = [];

function addMarker(markerIndex, markerData){
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(markerData.position[0], markerData.position[1]),
        icon: new google.maps.MarkerImage(
            icons[markerData.type],
            null, //size is determined at runtime
            null, // origin is 0,0
            null, // anchor is bottom center of the scaled image
            new google.maps.Size(30, 48)
        ),
        map: map
    });
    var activeUsers = markerData.active_users.length + ' aktive brukere';
    if(markerData.active_users.length == 0){
        activeUsers = 'ingen aktive brukere';
    }else if(markerData.active_users.length == 1){
        activeUsers = '1 aktiv bruker';
    }
    
    var infoWindowContent = '<h3>' + markerData.name + '</h3>' +
       '<p>' + markerData.description + '</p>' +
       '<p>' + activeUsers + '</p>' +
       '<p>Logg inn for å se hvem de er eller <br>si at du er her.</p>';
    if(user.id != 0){
        infoWindowContent = '<h3>' + markerData.name + '</h3>' +
           '<p>' + markerData.description + '</p>' +
           '<p>' + markerData.active_users.length + ' aktive brukere</p>' +
           '<p class="user-links"><a href="javascript:form_ishere(' + markerIndex + ')">Jeg er her</a><a href="javascript:form_willbehere(' + markerIndex + ')">Jeg skal hit</a><a href="">Chat</a></p>';
    }
    
    infoWindowContent = '<div class="info-window">' + infoWindowContent + '</div>';
    
    var infoWindow = new google.maps.InfoWindow({
          content: infoWindowContent
    });
    infoWindows[infoWindows.length] = infoWindow;
    
    //Display marker on click
    marker.addListener("click", function(){
        //Hide all other infoWindows
        for(var x = 0; x < infoWindows.length; x++){
            infoWindows[x].close();
        }
        //Display this infoWindow
        infoWindow.open(map, marker);
    });
    
    //Display marker on hover
    marker.addListener('mouseover', function() {
        //Do not display infoWindow on hover if the map is too zoomed out
        if(map.getZoom() < 15){
            return;
        }
        //Hide all other infoWindows
        for(var x = 0; x < infoWindows.length; x++){
            infoWindows[x].close();
        }
        //Display this infoWindow
        infoWindow.open(map, this);
    });

    /*marker.addListener('mouseout', function() {
        infoWindow.close();
    });*/
    
    //Store marker data
    markers[markerIndex].marker = marker;
}

/*
 * Map settings
 */

document.getElementById("updateMapType").addEventListener("change", function(e){
    switch(this.value){
        case "roadmap":
        case "satellite":
        case "hybrid":
        case "terrain":
            map.setMapTypeId(this.value);
    } 
});