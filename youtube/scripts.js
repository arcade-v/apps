    function getYouTube() {
      const input = document.getElementById('search-input').value.trim();

      // Extract 11-char video ID from multiple formats
      const match = input.match(
        /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|.*[?&]v=))([a-zA-Z0-9_-]{11})/
      );
      const videoId = match ? match[1] : input;

      const ytContainer = document.getElementById('yt');
      const embedContainer = document.createElement('div');
      embedContainer.className = 'embed-container';

      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}`;
      iframe.frameBorder = '0';
      iframe.allow =
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;

      const privacyNote = document.getElementById('privacy-note');

      // Fallback if no-cookie embed fails
      let fallbackTriggered = false;
      const fallbackTimer = setTimeout(() => {
        try {
          if (!fallbackTriggered && (!iframe.contentWindow || !iframe.contentWindow.document)) {
            fallbackTriggered = true;
            console.warn('Privacy embed failed, switching to youtube.com/embed');
            iframe.src = `https://www.youtube.com/embed/${videoId}`;
          }
        } catch (e) {
          if (!fallbackTriggered) {
            fallbackTriggered = true;
            iframe.src = `https://www.youtube.com/embed/${videoId}`;
          }
        }
      }, 2500);

      iframe.onload = () => clearTimeout(fallbackTimer);

      embedContainer.appendChild(iframe);
      ytContainer.innerHTML = '';
      ytContainer.appendChild(embedContainer);
    }

    document.getElementById('yt-form').addEventListener('submit', getYouTube);
