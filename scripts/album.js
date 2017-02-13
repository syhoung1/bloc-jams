var createSongRow = function (songNumber, songName, songLength) {
    var $row =
         $('<tr class="album-view-song-item">'
          +'  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
          +'  <td class="song-item">' + songName + '</td>'
          +'  <td class="song-item-duration">' + songLength + '</td>'
          +'</tr>');
        
    var onHover = function (event) {
        var songNumBox = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumBox.attr('data-song-number'));
        if (songNumber !== currentlyPlayingSongNumber) {
            songNumBox.html(playButtonTemplate);
        }
    };
    
    var offHover = function (event) {
        var songNumBox = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumBox.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumBox.html(songNumber);
        }
    };
    
    var clickHandler = function () {
        var songNumber = parseInt($(this).attr('data-song-number'));
        
        if (currentlyPlayingSongNumber !== null) {
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        } 
        
        if (currentlyPlayingSongNumber === songNumber) {
            if (currentSoundFile.isPaused() === true) {
                currentSoundFile.play();
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
            } else {
                currentSoundFile.pause();
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
            }
        
        } else if (currentlyPlayingSongNumber !== songNumber) {
            if (currentlyPlayingSongNumber !== null) {
                currentSoundFile.stop();
            }
            setSong(songNumber);
            updatePlayerBarSong();
            $(this).html(pauseButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPauseButton);
            currentSoundFile.play();
        }
    };
    
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row; 
};

var setCurrentAlbum = function (album) {
    currentAlbum = album;
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');

    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
    
    $albumSongList.empty();
    
    for (var i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration)
        $albumSongList.append($newRow);
     }
};

var trackIndex = function (album, song) {
    return album.songs.indexOf(song);
};

var nextSong = function () {
    currentSoundFile.stop();
    
    var getLastSongNumber = function (index) {
        return index ===  0 ? currentAlbum.songs.length : index;
    };

    var currentIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    
    currentIndex++;
    
    if (currentIndex >= currentAlbum.songs.length) {
        currentIndex = 0;
    }
    
    setSong(currentIndex + 1);
    updatePlayerBarSong();
    currentSoundFile.play();
    
    var lastSongNumber = getLastSongNumber(currentIndex);

    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function () {
    currentSoundFile.stop();
    var currentIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    
    var findNextSongNumber = function (index) {
        if (index >= currentAlbum.songs.length - 1) {
            return index = 1; 
        } else {
            return index += 2;
        }
    };
    
    if (currentIndex <= 0) {
        currentIndex = currentAlbum.songs.length - 1;
    } else {
        currentIndex--;
    };
    
    setSong(currentIndex + 1);
    updatePlayerBarSong();
    currentSoundFile.play();
    
    var nextSongNumber = findNextSongNumber(currentIndex);

    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $nextSongCell = getSongNumberCell(nextSongNumber);

    $previousSongNumberCell.html(pauseButtonTemplate);
    $nextSongCell.html(nextSongNumber);
};

var toggleSong = function () {
    var $currentSongCell = getSongNumberCell(currentlyPlayingSongNumber);
    if (currentlyPlayingSongNumber === null) {
        setSong(1);
        currentSoundFile.play();
        updatePlayerBarSong();
        getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
    } else if (currentlyPlayingSongNumber !== null) {
        if (currentSoundFile.isPaused() === true) {
          currentSoundFile.play();
          $('.main-controls .play-pause').html(playerBarPauseButton);
          $currentSongCell.html(pauseButtonTemplate);
        } else {
          currentSoundFile.pause();
          $('.main-controls .play-pause').html(playerBarPlayButton);
          $currentSongCell.html(playButtonTemplate);
        }
    }
};

var updatePlayerBarSong = function () {
    $('.currently-playing .artist-name').text(currentAlbum.artist); 
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-song-mobile').text(currentAlbum.artist + ' - ' + currentSongFromAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);
};

var setSong = function (songNumber) {
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: [ 'mp3' ],
        preload: true
    });
    
    setVolume(currentVolume);
};

var setVolume = function (volume) {
    if (currentSoundFile) {
        currentVolume = volume;
    }
};

var getSongNumberCell = function (number) {
    return $('.song-item-number[data-song-number="' + number + '"]')
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play">';
var playerBarPauseButton = '<span class="ion-pause">';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $nextButton = $('.main-controls .next');
var $previousButton = $('.main-controls .previous');
var $playPauseButton = $('.main-controls .play-pause')

$(document).ready(function () {
    setCurrentAlbum(albumPicasso);
    $nextButton.click(nextSong);
    $previousButton.click(previousSong);
    $playPauseButton.click(toggleSong);
});
