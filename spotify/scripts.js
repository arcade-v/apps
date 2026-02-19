function getSpotify() {
  const input = document.getElementById('search-input').value.trim();
  let spotifyPath = '';

  // Case 1: Spotify URL (strip queries)
  let matchUrl = input.match(/(?:https:\/\/open\.spotify\.com\/)([a-zA-Z0-9\/]+)/);
  if (matchUrl && matchUrl[1]) {
    spotifyPath = matchUrl[1].split('?')[0]; // remove ?si=... etc.
  }

  // Case 2: Spotify URI (spotify:track:ID, spotify:album:ID, spotify:playlist:ID)
  else if (input.startsWith("spotify:")) {
    spotifyPath = input.replace("spotify:", "").replace(/:/g, "/");
  }

  // Case 3: Raw ID (22-char alphanumeric)
  else if (/^[A-Za-z0-9]{22}$/.test(input)) {
    // Default to track, but you could make this configurable
    spotifyPath = "track/" + input;
  }

  // Fallback
  else {
    spotifyPath = input;
  }

  if (spotifyPath) {
    const embedUrl = "https://open.spotify.com/embed/" + spotifyPath;
    document.getElementById("yt").innerHTML =
      '<div class="embed-container">' +
        '<iframe src="' + embedUrl + '" ' +
        'width="100%" height="380" frameborder="0" ' +
        'allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture">' +
        '</iframe>' +
      '</div>';
  }
}
