var createSongRow = function (songNumber, songName, songLength) {
    var $row =
         $('<tr class="album-view-song-item">'
          +'  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
          +'  <td class="song-item">' + songName + '</td>'
          +'  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
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
                updateSeekBarWhileSongPlays();
                $('.volume .fill').width(currentVolume + '%');
                $('.volume .thumb').css({left: currentVolume + '%'});
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
            updateSeekBarWhileSongPlays();
            $('.volume .fill').width(currentVolume + '%');
            $('.volume .thumb').css({left: currentVolume + '%'});
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
    $('.volume .fill').width(currentVolume + '%');
    $('.volume .thumb').css({left: currentVolume + '%'});
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    
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
    $('.volume .fill').width(currentVolume + '%');
    $('.volume .thumb').css({left: currentVolume + '%'});
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    
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
        updateSeekBarWhileSongPlays();
        updatePlayerBarSong();
        $('.volume .fill').width(currentVolume + '%');
        $('.volume .thumb').css({left: currentVolume + '%'});
        getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
    } else if (currentlyPlayingSongNumber !== null) {
        if (currentSoundFile.isPaused() === true) {
          currentSoundFile.play();
          updateSeekBarWhileSongPlays();
          $('.volume .fill').width(currentVolume + '%');
          $('.volume .thumb').css({left: currentVolume + '%'});
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
        currentSoundFile.setVolume(volume);
        currentVolume = volume;
    }
};

var getSongNumberCell = function (number) {
    return $('.song-item-number[data-song-number="' + number + '"]')
};

var updateSeekPercentage = function ($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
    
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
};

var updateSeekBarWhileSongPlays = function () {
    if (currentSoundFile) {
        currentSoundFile.bind('timeupdate', function (event) {
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');
            var timePlayed = Math.floor(this.getTime());
            var songLength = Math.floor(this.getDuration());
            
            setTotalTime(songLength);
            setCurrentTimeInPlayerBar(timePlayed);
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
    }
};

var seekTime = function (time) {
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
    }
};

var updateSongFromTimeBar = function () {
    var $seekBar = $('.seek-control .fill');
    var fillBarPercentage = $seekBar.width() / $('.seek-control .seek-bar').width();
    var songTime = Math.floor(fillBarPercentage * currentSoundFile.getDuration());
    
    seekTime(songTime);
};

var updateVolumeFromPlayBar = function () {
    var $seekBar = $('.volume .fill');
    var fillBarPercentage = $seekBar.width() / $('.volume .seek-bar').width() * 100;

    setVolume(fillBarPercentage);
};

var setCurrentTimeInPlayerBar = function (currentTime) {
    var time = filterTimeCode(currentTime);
    $('.current-time').text(time);
};

var setTotalTime = function (totalTime) {
    var time = filterTimeCode(totalTime);
    $('.total-time').text(time);
}

var filterTimeCode = function (timeInSeconds) {
    var time = Math.floor(parseFloat(timeInSeconds));
    var minutes = Math.floor(time / 60);
    var tensSecond = Math.floor((time % 60) / 10);
    var onesSecond = ((time % 60) % 10);
    return minutes + ':' + tensSecond + onesSecond;
};

var setUpSeekBar = function () {
    var $seekBars = $('.player-bar .seek-bar');
    
    $seekBars.click(function (event) {
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();        
        var seekBarFillRatio = offsetX / barWidth;
        var $seekParent = $(this).parent();
        
        if ($seekParent.hasClass('volume') === true) {
            updateSeekPercentage($('.volume .seek-bar'), seekBarFillRatio);
            updateVolumeFromPlayBar();
        } else {
            updateSeekPercentage($('.seek-control .seek-bar'), seekBarFillRatio);
            updateSongFromTimeBar();
        }
    });
    
    $seekBars.find('.thumb').mousedown(function (event) {
        var $seekBar = $(this).parent();
        var $seekParent = $(this).parentsUntil('volume').hasClass('volume');
        
        $(document).bind('mousemove.thumb', function (event) {
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();            
            var seekBarFillRatio = offsetX / barWidth;
            
            if ($seekParent === true) {
                updateSeekPercentage($('.volume .seek-bar'), seekBarFillRatio);
                updateVolumeFromPlayBar();
            } else {
                updateSeekPercentage($('.seek-control .seek-bar'), seekBarFillRatio);
                updateSongFromTimeBar();
            }
        });
        
        $(document).bind('mouseup.thumb', function (event) {
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mousedown.thumb');
        })
    });
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
    setUpSeekBar();
    $nextButton.click(nextSong);
    $previousButton.click(previousSong);
    $playPauseButton.click(toggleSong);
});
