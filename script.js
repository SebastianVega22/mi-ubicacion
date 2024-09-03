var map;
var targetLat = 4.7399325; // Latitud de la nueva ubicación específica (Cra. 145a #132b-28, Bogotá)
var targetLon = -74.1303559; // Longitud de la nueva ubicación específica
var qrTimer;
var marginOfError = 0.005; // Margen de error en grados (~555 metros)

document.getElementById('idForm').addEventListener('submit', function(event) {
    event.preventDefault();
    getLocation();
});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, function(error) {
            if (error.code === error.TIMEOUT) {
                getLocation(); // Reintentar si hubo un timeout
            } else {
                showError(error);
            }
        }, {
            enableHighAccuracy: true, // Solicita la máxima precisión
            timeout: 10000, // Espera máxima de 10 segundos
            maximumAge: 0 // No usar posiciones anteriores
        });
    } else {
        alert("La geolocalización no es soportada por este navegador.");
    }
}

function showPosition(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var accuracy = position.coords.accuracy; // Precisión en metros

    var zoomLevel = accuracy < 50 ? 18 : 15;

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

    // Validar si la ubicación está dentro del margen de error más amplio
    if (Math.abs(lat - targetLat) <= marginOfError && Math.abs(lon - targetLon) <= marginOfError) {
        message.innerHTML += "Te encuentras en el sitio. Generando código QR...";
        generateQR();
    } else {
        message.innerHTML += "No te encuentras en el sitio.";
        clearQRCode();
    }
}

function showError(error) {
    var message = document.getElementById('message');
    switch(error.code) {
        case error.PERMISSION_DENIED:
            message.textContent = "El usuario negó la solicitud de geolocalización.";
            break;
        case error.POSITION_UNAVAILABLE:
            message.textContent = "La información de ubicación no está disponible.";
            break;
        case error.TIMEOUT:
            message.textContent = "La solicitud de ubicación ha caducado.";
            break;
        case error.UNKNOWN_ERROR:
            message.textContent = "Se produjo un error desconocido.";
            break;
    }
}

function generateQR() {
    var qrCodeDiv = document.getElementById('qrCode');
    qrCodeDiv.innerHTML = "";
    
    // Generar el código QR
    var qr = new QRCode(qrCodeDiv, {
        text: "https://www.youtube.com",
        width: 128,
        height: 128,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
    
    // Borrar el QR después de 3 minutos
    qrTimer = setTimeout(clearQRCode, 180000);
}

function clearQRCode() {
    var qrCodeDiv = document.getElementById('qrCode');
    qrCodeDiv.innerHTML = "<p>El código QR ha expirado.</p>";
    clearTimeout(qrTimer);
}


    var qrCodeDiv = document.getElementById('qrCode');
    qrCodeDiv.innerHTML = "<p>El código QR ha expirado.</p>";
    clearTimeout(qrTimer);
}

