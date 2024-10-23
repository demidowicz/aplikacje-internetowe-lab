// Inicjalizacja mapy Leaflet
const map = L.map('map').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);

// Obsługa przycisku "Moja lokalizacja"
document.getElementById('myLocation').addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        L.marker([latitude, longitude]).addTo(map).bindPopup('Twoja lokalizacja').openPopup();
        map.setView([latitude, longitude], 13);
    }, (error) => {
        alert('Nie można uzyskać dostępu do lokalizacji.');
    });
});

// Obsługa przycisku "Zapisz mapę"
document.getElementById("saveMap").addEventListener("click", function () {
    leafletImage(map, function (err, canvas) {

        const mapWidth = canvas.width;
        const mapHeight = canvas.height;

        let rasterMap = document.getElementById("rasterMap");
        rasterMap.width = mapWidth;
        rasterMap.height = mapHeight;

        let rasterContext = rasterMap.getContext("2d");
        rasterContext.drawImage(canvas, 0, 0, mapWidth, mapHeight);

        createPuzzle();
    });
});

// Tworzenie puzzli z zapisanej mapy
function createPuzzle() {
    clearPuzzle();
    const piecesContainer = document.getElementById('puzzlePieces');
    const puzzleContainer = document.getElementById('puzzleContainer');
    const rasterMap = document.getElementById('rasterMap');
    const pieces = [];
    const dropZones = [];

    const mapWidth = rasterMap.width;
    const mapHeight = rasterMap.height;

    const rows = 4;
    const cols = 4;

    const pieceWidth = mapWidth / cols;
    const pieceHeight = mapHeight / rows;

    // Generowanie 16 elementów (np. 100x100 px każdy)
    for (let i = 0; i < rows * cols; i++) {
        const piece = document.createElement('div');
        piece.classList.add('puzzle-piece');
        piece.draggable = true;
        piece.dataset.index = i; // Oryginalna pozycja

        const x = (i % cols) * pieceWidth;
        const y = Math.floor(i / cols) * pieceHeight;

        piece.style.width = `${pieceWidth}px`;
        piece.style.height = `${pieceHeight}px`;

        piece.addEventListener('dragstart', dragStart);
        piece.addEventListener('dragover', dragOver);
        piece.addEventListener('drop', drop);

        const dropZone = document.createElement('div');
        dropZone.classList.add('drop-zone');
        dropZone.style.width = `${pieceWidth}px`;
        dropZone.style.height = `${pieceHeight}px`;
        dropZone.dataset.index = i;
        dropZone.addEventListener('dragover', dragOver);
        dropZone.addEventListener('drop', drop);

        dropZones.push(dropZone);

        piece.style.backgroundImage = `url(${rasterMap.toDataURL()})`;
        piece.style.backgroundSize = `${mapWidth}px ${mapHeight}px`;
        piece.style.backgroundPosition = `-${x}px -${y}px`;

        pieces.push(piece);
    }

    pieces.sort(() => Math.random() - 0.5).forEach(piece => piecesContainer.appendChild(piece));
    dropZones.forEach(zone => puzzleContainer.appendChild(zone));
}

function clearPuzzle() {
    document.getElementById('puzzleContainer').innerHTML = '';
    document.getElementById('puzzlePieces').innerHTML = '';
}

let draggedOverPiece = null;

function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.dataset.index);
    event.dataTransfer.setData('sourceContainer', event.target.parentElement.id);
}

function dragOver(event) {
    event.preventDefault();
}

puzzleContainer.addEventListener('dragenter', (event) => {
    if (event.target.classList.contains('puzzle-piece')) {
        draggedOverPiece = event.target;
    }
});

function drop(event) {
    event.preventDefault();
    event.stopPropagation();

    const sourceIndex = event.dataTransfer.getData('text/plain');
    const sourcePiece = document.querySelector(`.puzzle-piece[data-index="${sourceIndex}"]`);
    console.log(sourcePiece.classList);
    console.log(event.target.classList);

    if (event.target.classList.contains('drop-zone')) {
        if (!event.target.firstChild) {
            event.target.appendChild(sourcePiece);
        }
    }
    else if (event.target.classList.contains('puzzle-piece')) {
        console.log('Zamiana miejscami');
        const sourceParent = sourcePiece.parentElement;
        const targetParent = event.target.parentElement;

        sourceParent.appendChild(event.target);
        targetParent.appendChild(sourcePiece);

    }

    checkPuzzle();
}

function checkPuzzle() {
    const pieces = puzzleContainer.querySelectorAll('.puzzle-piece');
    const dropZones = puzzleContainer.querySelectorAll('.drop-zone');
    const isComplete = Array.from(dropZones).every((dropZone, index) => { return dropZone.firstChild && dropZone.firstChild.dataset.index == index; });

    if (isComplete) {
        notifyUser('Gratulacje! Ułożyłeś puzzle.');
        console.log('Gratulacje! Ułożyłeś puzzle.');
        pieces.forEach(piece => piece.style.border = 'none');
    }
    else {
        pieces.forEach(piece => piece.style.border = '1px dashed rgb(0, 0, 0)');
    }
}

// Funkcja wyświetlająca powiadomienie
function notifyUser(message) {
    if (Notification.permission === 'granted') {
        new Notification(message);
    } else if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification(message);
            } else {
                console.log("Powiadomienia zostały zablokowane.");
            }
        });
    } else {
        console.log("Powiadomienia zostały zablokowane.");
    }
}

// Funkcja do żądania zgody na powiadomienia
function requestNotificationPermission() {
    if (Notification.permission === 'default') {
        console.log("Żądanie zgody na powiadomienia.");
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log("Powiadomienia zostały włączone.");
            }
            else {
                console.log("Powiadomienia zostały zablokowane.");
            }
        });
    }
}

// Wywołanie funkcji przy wejściu na stronę
requestNotificationPermission();