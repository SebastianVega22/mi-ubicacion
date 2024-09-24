var map;
var targetLat = 4.712562; // Latitud de la nueva ubicación específica (Cra. 145a #132b-28, Bogotá)
var targetLon = -74.196338; // Longitud de la nueva ubicación específica (Cra. 145a #132b-28, Bogotá)
var marginOfError = 0.005; // Margen de error en grados (~555 metros)
var walletAddress = ""; // Variable para almacenar la dirección de la wallet

// Redirección a la página de descarga de MetaMask para registrarse
document.getElementById('connectWallet').addEventListener('click', () => {
    window.open('https://metamask.io/es/download/', '_blank');
});

// Validar la dirección de la wallet conectada a MetaMask
document.getElementById('validateWallet').addEventListener('click', async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Solicitar acceso a la cuenta de MetaMask
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            walletAddress = accounts[0]; // Guardar la dirección de la wallet
            document.getElementById('walletValidationMessage').innerText = `Esta es su dirección de wallet: ${walletAddress}`;
        } catch (error) {
            console.error('Error al conectar con MetaMask:', error);
        }
    } else {
        alert('MetaMask no está instalada. Por favor, instala MetaMask.');
    }
});

// Manejo del formulario y validación de ubicación
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
        hideYouTubeLink(); // Asegura que el enlace no se muestre si la validación falla
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

function showYouTubeLink() {
    var linkContainer = document.getElementById('linkContainer');
    linkContainer.style.display = "block"; // Mostrar el enlace solo si la validación es exitosa
}

function hideYouTubeLink() {
    var linkContainer = document.getElementById('linkContainer');
    linkContainer.style.display = "none"; // Ocultar el enlace si la validación no es exitosa
}

