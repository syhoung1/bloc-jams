var createSongRow = function (songNumber, songName, songLength) {
    var template =
         '<tr class="album-view-song-item">'
        +'  <td class="song-item-number" data-song-number=" ' + songNumber + '">' + songNumber + '</td>'
        +'  <td class="song-item-title">' + songName + '</td>'
        +'  <td class="song-item-duration">' + songLength + '</td>'
        +'</tr>'
        ;
    
    var $row = $(template);
    
    var onHover = function (event) {
        var songNumBox = $(this).find('.song-item-number');
        var songNumber = songNumBox.attr('data-song-number');
        if (songNumber !== currentlyPlayingSongNumber) {
            songNumBox.html(playButtonTemplate);
        }
    };
    
    
    var offHover = function (event) {
        var songNumBox = $(this).find('.song-item-number');
        var songNumber = songNumBox.attr('data-song-number');

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumBox.html(songNumber);
        }
        
    };
    
    var clickHandler = function () {
        var songNumber = $(this).attr('data-song-number');
        
        if (currentlyPlayingSongNumber !== null) {
            var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        } 
        if (currentlyPlayingSongNumber === songNumber) {
            $(this).html(playButtonTemplate);
            currentlyPlayingSongNumber = null;
            currentSongFromAlbum = null;
            $('.main-controls .play-pause').html(playerBarPlayButton);
            
        } else if (currentlyPlayingSongNumber !== songNumber) {           
            $(this).html(pauseButtonTemplate);
            currentlyPlayingSongNumber = songNumber;
            currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
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
    var getLastSongNumber = function(index) {
        return index ==  0 ? currentAlbum.songs.length : index;
    };

    var currentIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    
    currentIndex++;
    
    if (currentIndex >= currentAlbum.songs.length) {
        currentIndex = 0;
    }

    currentlyPlayingSongNumber = currentIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentIndex];
    updatePlayerBarSong();
    
    var lastSongNumber = getLastSongNumber(currentIndex

    var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function () {
    var currentIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    
    var getNextSongNumber = function(index) {
        return index == currentAlbum.songs.length ? currentIndex = 0 : index;
    };
    
    currentIndex--;
    
    if (currentIndex < 0) {
        currentIndex = currentAlbum.songs.length - 1;
    }

    currentlyPlayingSongNumber = currentIndex - 1;
//    console.log(typeof(currentlyPlayingSongNumber));
    currentSongFromAlbum = currentAlbum.songs[currentIndex];
    updatePlayerBarSong();
    
    var nextSongNumber = getNextSongNumber(currentIndex);
    var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $nextSongNumberCell = $('.song-item-number[data-song-number="' + nextSongNumber + '"]');
    
    $previousSongNumberCell.html(pauseButtonTemplate);
    $nextSongNumberCell.html(nextSongNumber);
};

var updatePlayerBarSong = function () {
    $('.currently-playing .artist-name').text(currentAlbum.artist); 
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-song-mobile').text(currentAlbum.artist + ' - ' + currentSongFromAlbum);
    $('.main-controls .play-pause').html(playerBarPauseButton);
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
