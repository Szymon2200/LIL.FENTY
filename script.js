document.addEventListener('DOMContentLoaded', function() {
    const audioPlayer = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const songTitle = document.getElementById('songTitle');
    const songArtist = document.getElementById('songArtist');
    const coverImage = document.getElementById('coverImage');
    const playlist = document.getElementById('playlist');
    
    let currentSongIndex = 0;
    let songs = [];
    
    // Pobierz listę utworów z pliku JSON
    fetch('songs.json')
        .then(response => response.json())
        .then(data => {
            songs = data;
            renderPlaylist();
            if (songs.length > 0) {
                loadSong(currentSongIndex);
            }
        })
        .catch(error => console.error('Error loading songs:', error));
    
    // Renderuj playlistę
    function renderPlaylist() {
        playlist.innerHTML = '';
        
        songs.forEach((song, index) => {
            const playlistItem = document.createElement('div');
            playlistItem.classList.add('playlist-item');
            if (index === currentSongIndex) {
                playlistItem.classList.add('active');
            }
            
            playlistItem.innerHTML = `
                <img src="${song.coverUrl}" alt="${song.title}">
                <div class="playlist-item-info">
                    <h3>${song.title}</h3>
                    <p>${song.artist}</p>
                </div>
            `;
            
            playlistItem.addEventListener('click', () => {
                currentSongIndex = index;
                loadSong(currentSongIndex);
                updateActiveItem();
            });
            
            playlist.appendChild(playlistItem);
        });
    }
    
    // Załaduj utwór
    function loadSong(index) {
        if (songs.length === 0) return;
        
        const song = songs[index];
        songTitle.textContent = song.title;
        songArtist.textContent = song.artist;
        coverImage.src = song.coverUrl;
        
        // Konwertuj link Google Drive na bezpośredni link do pliku
        const fileId = extractGoogleDriveFileId(song.driveUrl);
        const directUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
        
        audioPlayer.src = directUrl;
        audioPlayer.load();
        
        if (audioPlayer.paused) {
            audioPlayer.play().then(() => {
                playBtn.textContent = '❚❚';
            }).catch(error => {
                console.error('Playback failed:', error);
            });
        } else {
            audioPlayer.play();
        }
        
        updateActiveItem();
    }
    
    // Aktualizuj aktywny element w playliście
    function updateActiveItem() {
        const items = document.querySelectorAll('.playlist-item');
        items.forEach((item, index) => {
            if (index === currentSongIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    // Funkcja do wyodrębniania ID pliku z linku Google Drive
    function extractGoogleDriveFileId(url) {
        const match = url.match(/\/file\/d\/([^\/]+)/) || url.match(/id=([^&]+)/);
        return match ? match[1] : url;
    }
    
    // Event listeners
    playBtn.addEventListener('click', () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playBtn.textContent = '❚❚';
        } else {
            audioPlayer.pause();
            playBtn.textContent = '▶';
        }
    });
    
    prevBtn.addEventListener('click', () => {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(currentSongIndex);
    });
    
    nextBtn.addEventListener('click', () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(currentSongIndex);
    });
    
    volumeSlider.addEventListener('input', () => {
        audioPlayer.volume = volumeSlider.value;
    });
    
    audioPlayer.addEventListener('ended', () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(currentSongIndex);
    });
    
    audioPlayer.addEventListener('play', () => {
        playBtn.textContent = '❚❚';
    });
    
    audioPlayer.addEventListener('pause', () => {
        playBtn.textContent = '▶';
    });
});