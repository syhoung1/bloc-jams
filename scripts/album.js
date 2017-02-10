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
            $(this).html(playButtonTemplate);
            setSong(null);
            $('.main-controls .play-pause').html(playerBarPlayButton);
        
        } else if (currentlyPlayingSongNumber !== songNumber) {
            $(this).html(pauseButtonTemplate);
            setSong(songNumber - 1);
            updatePlayerBarSong();
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
    var getLastSongNumber = function (index) {
        return index ==  0 ? currentAlbum.songs.length : index;
    };

    var currentIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    
    currentIndex++;
    
    if (currentIndex >= currentAlbum.songs.length) {
        currentIndex = 0;
    }

    setSong(currentIndex);
    updatePlayerBarSong();
    
    var lastSongNumber = getLastSongNumber(currentIndex);

    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function () {
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
    }
    
    setSong(currentIndex);
    updatePlayerBarSong();
    
    var nextSongNumber = findNextSongNumber(currentIndex);

    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $nextSongCell = getSongNumberCell(nextSongNumber);

    $previousSongNumberCell.html(pauseButtonTemplate);
    $nextSongCell.html(nextSongNumber);
};

var updatePlayerBarSong = function () {
    $('.currently-playing .artist-name').text(currentAlbum.artist); 
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-song-mobile').text(currentAlbum.artist + ' - ' + currentSongFromAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);
};

var setSong = function (songNumber) {
    currentlyPlayingSongNumber = parseInt(songNumber + 1);
    currentSongFromAlbum = currentAlbum.songs[songNumber];
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

var $nextButton = $('.main-controls .next');
var $previousButton = $('.main-controls .previous');

$(document).ready(function () {
    setCurrentAlbum(albumPicasso);
    $nextButton.click(nextSong);
    $previousButton.click(previousSong);
});
