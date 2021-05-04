YouTube Chat Overlay
====================

This Chrome browser extension turns the  YouTube Live chat pop-out window into something that can be used to show chat comments in OBS Studio or other studio production software.

Unlike other YouTube Chat overlay extensions out there, this version will foward the chat message over a websocket connection to a secondary webpage, which can be used in OBS-Studio as a simple browser source. This makes capturing the chat messages from a Youtube Live video stream very easy -- no Chroma keying or window-capturing needed.  It also makes customizing the style pretty easy, with no Chrome extension development needed.

📺 Video demoing how to install and use here: https://www.youtube.com/watch?v=UOg3RvHO-xk

<img src="https://github.com/steveseguin/live-chat-overlay/raw/main/chat-screenshot.png" width="300">

## Installation

You can install this package manually, or install it from the Chrome Web Store. 

### Manual Installation

If manually installing, you just need to download and install this repositoary an "unpacked" extension in Chrome.

The download link is here: https://github.com/steveseguin/live-chat-overlay/archive/refs/heads/main.zip  Just extract the files to a folder once downloaded.

Next, in Chrome, launch the Extensions page:  * [chrome://extensions/](chrome://extensions/)

On that page, choose "Load unpacked", and navigate to the newly unpacked folder we downloaded, selecting it.  That's it! All installed.  :)

### Chrome Web Store Installation

The extension can be found in the store here: https://chrome.google.com/webstore/detail/youtube-chat-overlay/bahhfoidnfogingiolidoidmlkogjlhp

The webstore has a review process, which can take a few days to complete, so new releases and bug fixes can take a few days to become available. It will however auto-update the extension for you though and it's pretty easy to install this way.

## Usage

Open up the YouTube live chat for a video, and click popout chat to open it in a new window. Or replace the `VIDEOID` in the URL below with your video's ID.

`https://www.youtube.com/live_chat?is_popout=1&v=VIDEOID`

After the page loads, if the extension is loaded correctly, you will see a POP UP that contains a github-domain-based URL; COPY that URL and past it into your OBS as a browser source.  Make the browser source 1280x250 or 1920x250 in resolution.

To make a Youtube Chat message now appear in OBS, simply click on a chat message in the Youtube POP OUT window.

## Customization

If you wish to Stylize the YouTube Chat message overlay in OBS, you can edit this file: https://github.com/steveseguin/live-chat-overlay/blob/main/index.html

You can download it to your local drive and open it directly in OBS. To link the file to the correct websocket connection, you will also need to add ?session=XXXXXX to the end of the browser source local file link in OBS, where XXXXXX is the session value given to you by the Chrome extension when the chat starts and the popup is displayed.

`https://chat.overlay.ninja?session=sBtMwWrkhZ` 
to 
`C:\Users\Steve\Desktop\index.html?session=sBtMwWrkhZ`

![image](https://user-images.githubusercontent.com/2575698/115710917-e929d780-a340-11eb-9bb8-15dd5e603904.png)

## Credits

Most of this CSS and JavaScript came from a video by [ROJ BTS](https://www.youtube.com/watch?v=NHy9D4ClTvc), so huge thanks to him for the initial work!

Also thank you to aaronpk @ https://github.com/aaronpk/live-chat-overlay, as their work is what this code builds upon.

-steve

