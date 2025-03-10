+++
title = 'Weeknotes 001'
date = 2025-01-12T10:12:00+00:00
draft = false
weather = '5°C Mostly Clear'
location = '50.79°N, 3.65°W'
tags = ['weeknotes']
customcss = 'custom.css'
description = 'Week notes for the 2nd week of 02025'
+++


The first proper back to work week of the year, after a concerted effort to make sure I didn't spend too much time at the keyboard over christmas.

I have an ever changing list of things I want to work on - a mix of both short experiments, and longer term projects. The trouble is that the short-term items end up being not so short term and start pushing the longer ones out. I'm getting better at evaluating whether something is worth pursuing, and the result is that i am still building, so I'm not too worried.

---

The majority of this week was spent on a new 'experiment' i'm calling for the time being vidpads. As the week progressed, it became clear that i might want to push this beyond quick and dirty into something more polished.

It's essentially a video player with a few bells and whistles. So a lot of the first tasks were about getting a video to play.

Typically, most of my projects are React Native, or at least heavily mobile centric. This project however is primarily browser based, with mobile compatibility. React is much the same in the browser, but the surrounding stack is quite different. Although I have long been familiar with building for web, there has been plenty of "updating of knowledge".

---

A early task was extracting a thumbnail from a html video element. There were three approaches I considered:

- using ffmpeg.wasm
- using webcodecs
- simply drawing the video to a html canvas

The first was in play because I had already built [ffmpeg.wasm](https://ffmpegwasm.netlify.app) into the app with a view to using some of its features to manipulate videos. And indeed it works fine, if you can ignore the fact that its a 30meg+ dependency.

[Webcodecs](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API) are an interesting relatively recent development, which at first glance should give much of the power of ffmpeg without the large dependency.
With further investigation, it turns out to be surprisingly low level for a browser api, to the point where I needed a companion library [MP4Box.js](https://gpac.github.io/mp4box.js/) to achieve anything. And still it is non-trivial.
I did eventually get a thumbnail out of it, but getting one from an arbitrary time proved tricky, at which point I realised how much time I'd spent and left it there.

The last option was simple, and just worked. I felt a bit cheated out of the time I had spent on the other two options, but I had learnt at least something new. Webcodecs is perhaps something to return to.

---

The rest of the week was spent building out features and refining - progress was quite speedy.

HTML Drag and Drop is still a mess when it comes to controlling the drag thumbnail - hacks applied. Claude/Cursor AI made a fair effort at translating my requirements, but just got into a mess. In the end I solved it by disregarding it's advice.

I was able to get controlled HTML video playback working well, with custom start/end and looping. I was dreading implementing Youtube playback, but in the end it wasn't so bad. Thumbnail extraction seems like it will need server functions (to hide an API key), which I really want to avoid, but there is some hope in [oEmbed](https://oembed.com)

---

I've been writing this in [Zed](https://zed.dev), as the constant "helpful" auto-complete in [Cursor](https://www.cursor.com) drives me insane for writing.
As it's new and unfamiliar, here are some things I had to do in order to get it to behave:

- word wrap - add ```{ "soft_wrap": "editor_width" }``` in settings.json
- you can indeed open links in the web browser with cmd-click)
- i still can't get cmd-1,2,3... etc to switch between editors. the keymap seems to be there, but nothing happens...
- seems to be no color picker available yet - there is [this](https://github.com/nickpoorman/colord?tab=readme-ov-file#zed-integration) but is fairly primitive

---

Yeah, this has been way too long for [weeknotes](https://medium.com/wethecatalysts/weeknotes-how-to-write-one-in-30-minutes-ef3eef0e41f7). Will refine for next week...

---

## Links of Note

#### [Pimosa](https://pimosa.app)

A simple Video/Photo/etc editor. I have found myself needing to edit videos more often, and existing tools look just frightful.


#### [Synthesizing Music from JSON](https://phoboslab.org/log/2025/01/synth)

I have a real thing for web based synths.
> tl;dr: [pl_synth](https://github.com/phoboslab/pl_synth) is a tiny music synthesizer for C & JS and an editor (“tracker”) to create instruments and arrangements.


#### [Literate Flatbush](https://kylebarron.dev/literate-flatbush/)

A detailed technical explanation of Flatbush, an efficient JavaScript implementation of a static, packed RTree spatial index that uses Hilbert curves for data organization.

I've been somewhat mindlessly using RBush quite a bit in recent projects.

#### [Building Bauble](https://ianthehenry.com/posts/bauble/building-bauble/)

A great piece of writing about a shader DSL written in [Janet](https://janet.guide) - which I want to play with at some point.
