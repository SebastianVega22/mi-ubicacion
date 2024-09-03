var map;

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("La geolocalización no es soportada por este navegador.");
    }
}

function showPosition(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    
    map = L.map('map').setView([lat, lon], 15);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    L.marker([lat, lon]).addTo(map)
        .bindPopup("¡Aquí estás!")
        .openPopup();
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("El usuario negó la solicitud de geolocalización.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("La información de ubicación no está disponible.");
            break;
        case error.TIMEOUT:
            alert("La solicitud de ubicación ha caducado.");
            break;
        case error.UNKNOWN_ERROR:
            alert("Se produjo un error desconocido.");
            break;
    }
}
