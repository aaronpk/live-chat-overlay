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
- Instagram (posts) (trigger it with a button)
- Instagram Live (click on chat messages.)
- Twitter (works with tweets and replies)
- Facebook Live chat (no pop up option; does not support Mobile/4G/LTE - wifi or ethernet only)
- Crowdcast.io
- Zoom.us (text chat) 
- polleverywhere.com (https://www.polleverywhere.com/discourses/xxxxx question page)

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

On that page, make sure developer mode is enabled, then choose "Load unpacked", and navigate to the newly unpacked folder we downloaded. Selecting the folder, click OK, and that's it! All installed. :)  Repeat this process if you wish to update the extension, as it will not auto-update if you had manually installed it.

## Usage

Open up the live chat for a video, and click popout chat to open it in a new window. Or replace the `VIDEOID` in the URL below with your video's ID.

`https://www.youtube.com/live_chat?is_popout=1&v=VIDEOID`

After the page loads, if the extension is loaded correctly, you will see a POP UP that contains a github-domain-based URL; COPY that URL and past it into your OBS as a browser source.  Make the browser source 1280x250 or 1920x250 in resolution.  If using Instagram/Twitter with images, maybe considering a height of 400px instead; also, for Twitter/IG, there is no pop-out -- so it just embeds into the main side.

![image](https://user-images.githubusercontent.com/2575698/127785452-ffb962ee-881f-4cba-82b9-a30ca67c5e24.png)


To make a Chat message now appear in OBS, simply click on a chat message in the Youtube/Twitch **POP OUT** window or whereever buttons appear.

You can re-use the same overlay in OBS or Vmix or wherever for all your chat inputs.

The link should be resuable between streams, but you can also manually set it to something specific via the plugin's settings page.

#### Sample of how it looks with Twitter:

![image](https://user-images.githubusercontent.com/2575698/127702900-c5052779-4c21-492d-af7b-869d4784a6a7.png)

#### And with Facebook live:

![image](https://user-images.githubusercontent.com/2575698/129591874-d68c0dbe-14cb-4ae6-a888-c6d3c6c3999a.png)

## Customization

#### Basic options

- Adding &center to the overlay link added to OBS will center the comments on the page

- Adding &showtime=10000 to the overlay link will have messages appear for 10-seconds (10,000-ms), before they auto-fade away. You can set it to whatever value you want really; less than 1000 isn't recommended.

example:
```
https://chat.overlay.ninja?session=sBtMwWrkhZ&showtime=5000
```

### Advanced customization options

If you wish to Stylize the Chat message overlay in OBS, you can edit this file: https://raw.githubusercontent.com/steveseguin/twitch-youtube-restream-chat-overlay/main/index.html

You can download it to your local drive and open it directly in OBS. To link the file to the correct websocket connection, you will also need to add ?session=XXXXXX to the end of the browser source local file link in OBS, where XXXXXX is the session value given to you by the Chrome extension when the chat starts and the popup is displayed.

`https://chat.overlay.ninja?session=sBtMwWrkhZ` 
to 
`C:\Users\Steve\Desktop\index.html?session=sBtMwWrkhZ`

![image](https://user-images.githubusercontent.com/2575698/115710917-e929d780-a340-11eb-9bb8-15dd5e603904.png)

#### Other styling options for simple changes

For simple CSS changes, you can add them to the OBS Browser Source itself, in the style sheet section, and it will apply to the index.html file without needing to actually edit it.

There are also some options buried in the Chrome extension itself, but those will likey be changing going into the future. You can change the color of the message background for example.


### Consolidate Messaging Extension

There's another Browser Extension made that's simliar to this one, however it usees Peer-to-Peer in place of a routing server to transport messages and it consolidates *all* messages into a single dashboard, rather than needing to interface with multiple windows to trigger Featured Messaging.  In many ways, it's superior, although it only supports streaming messagings, and not so much static content, like Instagram post comments.

Find that extension here: https://github.com/steveseguin/social_stream

It also has the nifty ability to auto-respond to messages and provides streamdeck hotkey support, for preset rapid-responses.

### VDO.Ninja

This particular Browser extension is maintained and supported to help provide VDO.Ninja users a powerful chat tool option for OBS. VDO.Ninja makes it easy to invite remote guests into OBS, VMix, or other production mixing software. Check out VDO.Ninja at https://vdo.ninja ; it's 100% free and open-source.

## Support

If you need support or have a bug to report, please feel free to join me at https://discord.vdo.ninja. 

## Credits

The code for this project was originally based on the works of:
- https://www.youtube.com/watch?v=NHy9D4ClTvc (ROJ BTS)
- https://github.com/aaronpk/live-chat-overlay (aaronpk).

-steve

