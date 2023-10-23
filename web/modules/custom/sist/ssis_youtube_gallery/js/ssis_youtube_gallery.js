

var tag = document.createElement('script');
tag.id = "youtube_api_script";
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var newPlayer;
function onYouTubeIframeAPIReady() {
  newPlayer = new YT.Player('main_video', {
    height: '400',
    width: '656',
    playerVars: { 'autoplay': 1, 'rel': 0, 'modestbranding': 1 }
  });
}

function playVideo(id, name, title, desc) {
  
  var playlist_item = document.getElementsByClassName("playlist-item");
  for (var i = 0; i < playlist_item.length; i++) {
    playlist_item[i].classList.remove("active");
  }

  var playlistItemLink = document.getElementById(id);
  var playListItem = playlistItemLink.closest(".playlist-item")
  playListItem.classList.add("active");


  // Hide the image place holder
  document.getElementById("img_placeholder").style.display = "none";

  var player_placeholder = document.getElementById("player_placeholder");
  // Add the video name
  var speaker_name = player_placeholder.getElementsByClassName('speaker-name')[0];
  speaker_name.innerHTML = name;
  // Add the title
  var speaker_title = player_placeholder.getElementsByClassName('speaker-title')[0];
  speaker_title.innerHTML = title;
  // Add the video description
  var speaker_desc = player_placeholder.getElementsByClassName('speaker-desc')[0];
  speaker_desc.innerHTML = desc;

  newPlayer.loadVideoById(id);

  player_placeholder.style.display = "block";
  document.getElementById('main_video').focus();
}
