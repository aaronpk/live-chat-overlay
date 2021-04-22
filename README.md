YouTube Chat Overlay
====================

This CSS and JS turns the popout YouTube chat window into something that can be used to show chat comments keyed over a video.  Unlike other YouTube Chat overlay extensions for Chrome, this one will foward the chat message over a websocket connection to a secondary webpage, which can be used in OBS-Studio as a browser source. This makes capturing the Chat messages for a Youtube Live video stream very easy -- no Chroma keying needed.

![chat-screenshot](chat-screenshot.png)

## Installation

Until the app is accepted by the Chrome extension store, you will need to install this package manually.

You can install this as an "unpacked" extension to do so. In Chrome, launch the Extensions page

* [chrome://extensions/](chrome://extensions/)

Then choose "Load unpacked", and navigate to this folder.

## Usage

Open up the YouTube live chat for a video, and click popout chat to open it in a new window. Or replace the `VIDEOID` in the URL below with your video's ID.

`https://www.youtube.com/live_chat?is_popout=1&v=VIDEOID`

After the page loads, if the extension is loaded correctly, you will see a POP UP that contains a github-domain-based URL; COPY that URL and past it into your OBS as a browser source.  Make the browser source 1280x250 or 1920x250 in resolution.

To make a Youtube Chat message now appear in OBS, simply click on a chat message in the Youtube POP OUT window.

## Credits

Most of this CSS and JavaScript came from a video by [ROJ BTS](https://www.youtube.com/watch?v=NHy9D4ClTvc), so huge thanks to him for the initial work!

Also thank you to https://github.com/aaronpk/live-chat-overlay for improving on the work, for which this code is based on.



