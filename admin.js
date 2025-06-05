document.addEventListener('DOMContentLoaded', function() {
    const songForm = document.getElementById('songForm');
    const currentSongsList = document.getElementById('currentSongs');
    let songs = [];
    
    // Załaduj istniejące utwory
    fetch('songs.json')
        .then(response => response.json())
        .then(data => {
            songs = data;
            renderSongsList();
        })
        .catch(error => {
            console.error('Error loading songs:', error);
            songs = [];
        });
    
    // Obsługa formularza
    songForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const songName = document.getElementById('songName').value;
        const artistName = document.getElementById('artistName').value;
        const driveUrl = document.getElementById('driveUrl').value;
        const coverUrl = document.getElementById('coverUrl').value;
        
        const newSong = {
            title: songName,
            artist: artistName,
            driveUrl: driveUrl,
            coverUrl: coverUrl
        };
        
        songs.push(newSong);
        saveSongs();
        renderSongsList();
        
        // Wyczyść formularz
        songForm.reset();
    });
    
    // Renderuj listę utworów
    function renderSongsList() {
        currentSongsList.innerHTML = '';
        
        songs.forEach((song, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${song.title} - ${song.artist}</span>
                <button class="delete-btn" data-index="${index}">Usuń</button>
            `;
            currentSongsList.appendChild(li);
        });
        
        // Dodaj event listeners do przycisków usuwania
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                songs.splice(index, 1);
                saveSongs();
                renderSongsList();
            });
        });
    }
    
    // Zapisz utwory do pliku JSON
    function saveSongs() {
        // W rzeczywistości na GitHub Pages nie możemy zapisywać plików,
        // więc admin musiałby ręcznie zaktualizować plik songs.json
        // W pełnej aplikacji byłoby to połączone z backendem
        
        // Tutaj tylko logujemy do konsoli
        console.log('Zaktualizowana lista utworów:', songs);
        alert('W prawdziwej aplikacji ta zmiana zostałaby zapisana. Na GitHub Pages musisz ręcznie zaktualizować plik songs.json.');
    }
});