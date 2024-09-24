var map;
var targetLat = 4.712562; // Latitud de la nueva ubicación específica (Cra. 145a #132b-28, Bogotá)
var targetLon = -74.196338; // Longitud de la nueva ubicación específica (Cra. 145a #132b-28, Bogotá)
var marginOfError = 0.005; // Margen de error en grados (~555 metros)

document.getElementById('idForm').addEventListener('submit', function(event) {
    event.preventDefault();
    getLocation();
});

function getLocation() {
    // Mostrar la animación de carga
    document.getElementById('loading').style.display = 'flex';

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, function(error) {
            if (error.code === error.TIMEOUT) {
                getLocation(); // Reintentar si hubo un timeout
            } else {
                showError(error);
            }
            // Ocultar la animación de carga
            document.getElementById('loading').style.display = 'none';
        }, {
            enableHighAccuracy: true, // Solicita la máxima precisión
            timeout: 10000, // Espera máxima de 10 segundos
            maximumAge: 0 // No usar posiciones anteriores
        });
    } else {
        alert("La geolocalización no es soportada por este navegador.");
        // Ocultar la animación de carga
        document.getElementById('loading').style.display = 'none';
    }
}

function showPosition(position) {
    // Ocultar la animación de carga al finalizar la validación
    document.getElementById('loading').style.display = 'none';

    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var accuracy = position.coords.accuracy; // Precisión en metros

    var zoomLevel = accuracy < 50 ? 18 : 15;

    if (map) {
        map.remove();
    }
    map = L.map('map').setView([lat, lon], zoomLevel);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    L.marker([lat, lon]).addTo(map)
        .bindPopup("¡Aquí estás con una precisión de " + accuracy + " metros!")
        .openPopup();

    var message = document.getElementById('message');
    
    // Imprimir las coordenadas obtenidas
    var coordinatesMessage = `Coordenadas obtenidas: Latitud: ${lat.toFixed(6)}, Longitud: ${lon.toFixed(6)}`;
    message.innerHTML = coordinatesMessage + "<br>";

    // Validar si la ubicación está dentro del margen de error
    if (Math.abs(lat - targetLat) <= marginOfError && Math.abs(lon - targetLon) <= marginOfError) {
        message.innerHTML += "Te encuentras en el sitio. Mostrando enlace...";
        showYouTubeLink();
    } else {
        message.innerHTML += "No te encuentras en el sitio.";
        hideYouTubeLink();
    }
}

