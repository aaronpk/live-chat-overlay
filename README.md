YouTube/Twitch and More - Chat Overlay Ninja
============================================

This Chrome browser extension turns your social chat and comments section into selectable social overlays for OBS Studio or other studio production software.

This Chat overlay extensions will forward the selected chat message over a web-socket connection to a secondary webpage, which can be used in OBS-Studio as a simple browser source. This makes capturing the chat messages from a live video stream very easy and fast -- no Chroma keying or window-capturing needed. It also makes customizing the style pretty easy, with no Chrome extension development needed.

📺 Video demoing how to install and use here: https://www.youtube.com/watch?v=UOg3RvHO-xk

#### Supported sites (requests welcomed)
- glimesh.tv (pop-out chat)
- youtube.com (pop-out chat)
- twitch.tv (pop-out chat)
- restream.io (go here: https://chat.restream.io/chat)
- trovo.live (pop-out chat)
- Instagram (not yet in the chrome store)
- Twitter (Works with tweets and replies - not yet in the chrome store)

![image](https://user-images.githubusercontent.com/2575698/121636030-485cbc00-ca55-11eb-8416-4d7626653fa8.png)

If using restream.io as a chat source, you can access all your social sites, including Facebook, from a single chat pop-out, as seen below:

![image](https://user-images.githubusercontent.com/2575698/124319035-9726de80-db47-11eb-9b64-88e9cc2ca1d8.png)


## Installation

You can install this package manually, or install it from the Chrome Web Store. If you install the extension manually, make sure to remove the store version to avoid conflicts and double-popup problems, etc.

#### Chrome Web Store Installation

The extension can be found in the store here: https://chrome.google.com/webstore/detail/youtube-chat-overlay/bahhfoidnfogingiolidoidmlkogjlhp

The webstore has a review process, which can take a few days to complete, so new releases and bug fixes can take a few days to become available. It will however auto-update the extension for you though and it's pretty easy to install this way.

#### Manual Installation

If manually installing, you just need to download and install this repository an "unpacked" extension in Chrome.

The download link is here: https://github.com/steveseguin/twitch-youtube-restream-chat-overlay/archive/refs/heads/main.zip Just extract the files to a folder once downloaded.

Next, in Chrome, launch the Extensions page: * chrome://extensions/

On that page, choose "Load unpacked", and navigate to the newly unpacked folder we downloaded, selecting it. That's it! All installed. :)

## Usage

Open up the live chat for a video, and click popout chat to open it in a new window. Or replace the `VIDEOID` in the URL below with your video's ID.

`https://www.youtube.com/live_chat?is_popout=1&v=VIDEOID`

After the page loads, if the extension is loaded correctly, you will see a POP UP that contains a github-domain-based URL; COPY that URL and past it into your OBS as a browser source.  Make the browser source 1280x250 or 1920x250 in resolution.  If using Instagram/Twitter with images, maybe considering a height of 400px instead; also, for Twitter/IG, there is no pop-out -- so it just embeds into the main side.

![image](https://user-images.githubusercontent.com/2575698/127703386-d0246475-915d-45f8-9d98-1223ec43b807.png)

To make a Chat message now appear in OBS, simply click on a chat message in the Youtube/Twitch **POP OUT** window or whereever buttons appear.

YOu can re-use the same overlay in OBS or Vmix or wherever for all your chat inputs.

The link should be resuable between streams, but you can also manually set it to something specific via the plugin's settings page.

#### Sample of how it looks with Twitter:

![image](https://user-images.githubusercontent.com/2575698/127702900-c5052779-4c21-492d-af7b-869d4784a6a7.png)



## Customization

If you wish to Stylize the Chat message overlay in OBS, you can edit this file: https://raw.githubusercontent.com/steveseguin/twitch-youtube-restream-chat-overlay/main/index.html

You can download it to your local drive and open it directly in OBS. To link the file to the correct websocket connection, you will also need to add ?session=XXXXXX to the end of the browser source local file link in OBS, where XXXXXX is the session value given to you by the Chrome extension when the chat starts and the popup is displayed.

`https://chat.overlay.ninja?session=sBtMwWrkhZ` 
to 
`C:\Users\Steve\Desktop\index.html?session=sBtMwWrkhZ`

![image](https://user-images.githubusercontent.com/2575698/115710917-e929d780-a340-11eb-9bb8-15dd5e603904.png)

## Support

If you need support or have a bug to report, please feel free to join me at https://discord.vdo.ninja. 

## Credits

The code for this project was original based on the works of https://www.youtube.com/watch?v=NHy9D4ClTvc (ROJ BTS) and https://github.com/aaronpk/live-chat-overlay (aaronpk).

-steve

