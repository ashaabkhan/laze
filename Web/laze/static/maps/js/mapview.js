// This example displays a marker at the center of Australia.
// When the user clicks the marker, an info window opens.
// The maximum width of the info window is set to 200 pixels.

// maps api:
// https://developers.google.com/maps/documentation/javascript/examples/map-simple

var markers = [];

function toggleMenuGroup(event) {
    $(event.target).parent().children(".menu-group-body").each((i, child) => {
        $(child).toggleClass("collapsed");
    });
    $(event.target).children().first().toggleClass("rotate");
}

function createMenuGroupListeners(){
    $(".menu-group-header").each((i, obj) => {
        $(obj).click(toggleMenuGroup);
    });
}

function initMap() {
    var strictBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(43.461, -80.559),
        new google.maps.LatLng(43.4872, -80.509), 
        
    )
    var wlu = {lat: 43.4735, lng: -80.5273};
    var tims = {lat: 43.4732, lng: -80.5255};
    var subway = {lat: 43.4727, lng: -80.5265};
    

    var map = new google.maps.Map(document.getElementById('map'), {
        minZoom:16,
        maxZoom:20,
        zoom: 16,
        center: wlu,
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControl: false
    });

    createPin("Tim Hortons", "text", tims, map);
    createPin("Subway Bricker", "text", subway, map);

    let overlay = setOverlay(map);
    addOverlayClickListener(map, overlay);
    google.maps.event.addListener(map, 'dragend', function() {
        if (strictBounds.contains(map.getCenter())) return;
        var c = map.getCenter(),
         x = c.lng(),
         y = c.lat(),
         maxX = strictBounds.getNorthEast().lng(),
         maxY = strictBounds.getNorthEast().lat(),
         minX = strictBounds.getSouthWest().lng(),
         minY = strictBounds.getSouthWest().lat();

     if (x < minX) x = minX;
     if (x > maxX) x = maxX;
     if (y < minY) y = minY;
     if (y > maxY) y = maxY;

     map.setCenter(new google.maps.LatLng(y, x));
    });
    google.maps.event.addListener(map, 'zoom_changed', function() {
        if (map.getZoom() < minZoomLevel) map.setZoom(minZoomLevel);
    });
}

function addOverlayClickListener(map, overlay) {
    overlay.addListener('click', (event) => {
        let newCoordinates = {lat: event.latLng.lat(), lng: event.latLng.lng()};
        $('.form-control').val('').removeClass('empty-input-field');
        $('#newPinDialog').modal('show');
        $('#newPinDialog .btn-primary').off().click(function() {
            let location = $('#location-title').val();
            let message = $('#message-text').val();
            if (location === '' || message === '') {
                $('.form-control').addClass('empty-input-field');
            } else {
                $('#newPinDialog').modal('hide');
                createPin(location, message, newCoordinates, map);
            }
        });
    });
}

function createPin(location, message, coordinates, map) {
    let newMarker = new google.maps.Marker({
        position: coordinates,
        map: map,
        icon: pinIcon,
        title: location
    });
    let newMarkerString = '<h1 style="font-family: Varela-Round; font-size:1.5rem">' + location + '</h1><br>' + '<p style="font-family: Varela-Round; font-size:1rem">' + message + '</p>';
    let newMarkerWindow = new google.maps.InfoWindow({
        content: newMarkerString,
        maxWidth: 200
    });
    newMarker.addListener('click', () => {
        newMarkerWindow.open(map, newMarker);
    });
    markers.push(newMarker);
}

function setOverlay(map){
    var imageBounds = {
        north: 43.4763,
        south: 43.4687,
        east: -80.5192,
        west: -80.5331
    };
    wluOverlay = new google.maps.GroundOverlay(
        overlayUrl,
        imageBounds);
    wluOverlay.setMap(map);
    
    return wluOverlay;
}

createMenuGroupListeners();