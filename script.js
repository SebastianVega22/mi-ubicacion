var map;
var targetLat = 4.712562; // Latitud de la nueva ubicación específica (Cra. 145a #132b-28, Bogotá)
var targetLon = -74.196338; // Longitud de la nueva ubicación específica (Cra. 145a #132b-28, Bogotá)
var marginOfError = 0.005; // Margen de error en grados (~555 metros)

document.getElementById('idForm').addEventListener('submit', function(event) {
    event.preventDefault();
    getLocation();
});
// Redirección a la página de descarga de MetaMask para registrarse
document.getElementById('obtenerWallet').addEventListener('click', () => {
    window.open('https://metamask.io/es/download/', '_blank');
});
//VALIDAR WALLET EN METAMASK
//VALIDAR WALLET EN METAMASK
document.getElementById('validarWallet').addEventListener('click', async function() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Solicitar acceso a MetaMask
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            const walletAddress = accounts[0]; // Guardar la primera cuenta en la variable

            // Imprimir la dirección en pantalla
            document.getElementById('message').innerHTML = `Esta es su Wallet: ${walletAddress}`;
        } catch (error) {
            // Si el usuario rechaza la conexión o hay otro error
            console.error("Error al conectar con MetaMask:", error);
            document.getElementById('message').innerHTML = "Error al conectar con MetaMask. Asegúrese de que esté instalada y habilitada.";
        }
    } else {
        // Si MetaMask no está instalada
        document.getElementById('message').innerHTML = "MetaMask no está instalada. Por favor instálela para validar su Wallet.";
    }
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
        message.innerHTML += "Te encuentras en el sitio. Serás redirigido en 10 segundos...";
        setTimeout(redirectToUniminuto, 10000); // Espera de 10 segundos antes de redirigir
    } else {
        message.innerHTML += "No te encuentras en el sitio.";
        hideYouTubeLink();
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

function redirectToUniminuto() {
    // Redirigir automáticamente al enlace de Aulas Uniminuto
    window.location.href = "https://www.aulasuniminuto.edu.co";
}

