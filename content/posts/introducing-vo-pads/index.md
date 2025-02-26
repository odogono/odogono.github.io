+++
title = 'Introducing VO Pads'
date = 2025-02-26T13:18:00+00:00
draft = false
weather = '8°C Cloudy'
location = '50.79°N, 3.65°W'
tags = ['react', 'vo-pads']
customcss = 'custom.css'
description = 'I done built a thing'
+++

This week I finally [got my project](https://vo.odgn.net) into a state where I could show the outside world and talk about it a little.



{{< youtube id="R0DIJ43FIp0" >}}



## What is it

[VO Pads](https://vo.odgn.net) (or Video Operator Pads), is not a feminine hygiene product, but a Video Player. A video player with pretensions of being something like an [Akai MPC](https://en.wikipedia.org/wiki/Akai_MPC).

It allows you to import videos using an interface consisting of a grid of 16 pads, much like an MPC. Once loaded, the video can be played by pressing on the pad. By default, when you let go, the video stops playing. 

It supports local mp4 files, and probably more appealing, YouTube videos - which are presented as embedded players.

{{< image-cropped src="img/vopads-screen.jpg" alt="Strips of digits, all in a row" process="fill" width="640" height="200" >}}

Multiple (well, up to 16) videos can be loaded and played at the same time.

The Pad contents can be cut, copied, and pasted easily to other pads, or into other instances of the app.

To stop this sounding like a cacophony, there are a variety of options an controls that you can apply to each Pad.

You can set the start and end of the video, turn the volume up and down, reduce or increase the play-rate, set the pad to play in a loop, and control the play priority, amongst a few other options.

Triggering the Pad/Video can be achieved using touch/mouse by tapping on the pad, by hitting the keyboard assigned to that pad, and if you have a MIDI device then that can be mapped to a particular pad as well.


In order to allow some degree of composition, there are two(!) types of sequencer.

The first is a [Step Sequencer](https://en.wikipedia.org/wiki/Music_sequencer#Step_sequencer_(step_recording_mode), which allows you to punch in patterns of when a pad should play on a grid. 

The second is a time sequencer, which resembles something you would find in traditional video editing software.


Projects can have a name and an image (which shows when idle) assigned to them, and they can be shared by copying a URL link, which contains the entire project data. 
This means that nothing is stored on the server, it is all local to the browser.



## How it came to be

My original itch was that I wanted a better way to play tutorial videos. 

I was learning [how to scratch](https://www.youtube.com/watch?v=3IEpb2vh4Ws), and like many things it's mostly a learn by copy exercise. The tutorial would explain a technique, and then show how it was done, maybe a couple of times, and then move on to the next thing.

So I would end up rewinding the video, pressing play, repeat ad infinitum until it got through.

There had to be a better way!

I considered how some sort of app would help with this. The main blocker was that I couldn't picture the interface. Or decide particularly what platform this would work on.

Over xmas, i spent a considerable amount of time fiddling with [Koala Sampler](https://www.koalasampler.com). If you haven't come across it yet, it's an absolute joy of an app. It lets you play and manipulate sounds and compose them into tracks.

Seriously, its like £5, [go get](https://apps.apple.com/app/apple-store/id1449584007?pt=278965&ct=homepage&mt=8) [it](https://play.google.com/store/apps/details?id=com.elf.koalasampler).

So I thought, 'well, what if this... but video!?'. 

And there my path of madness started.

The first versions were built around the use of local mp4 files. I could drag from a folder into the app and play. Great for me, a little tough to share with others.

But then it occured that supporting YouTube might make things more immediate. The main fear of course was that the YT video player really doesn't want to be used in any other way than intended.

After some experimentation, it turned out that YT videos are mostly viable. With some careful setup, its possible to have it player almost immediately. Certain browsers are better than this of course.

Encouraged by this, the rest of the development was pretty straightforward. Helped of course by the fact that I was having fun using it, even in early states.


## What went well

### Having an Existing Inspiration

Most work is built on the shoulders of giants, and in the case of [Koala Sampler](https://www.koalasampler.com), that gave me great uplift. 

It meant that I didn't have to think about interface too hard, at least initially, and when I got stuck I had something tangible to compare to.

Of course, as work progressed, it started diverging in ways that made sense. This is not a sound player, and video (especially YT) limits the amount of manipulation the app can do.


### Local first

The decision not to make this server based happened early on. It wasn't a hard call really - most instruments/players are by definition 'offline'. 

There was always that temptation that adding certain server features might make things nicer, but I managed to resist. At least for this first version.


### Libraries

This is my first major React web app in quite a while (I'm normally a React Native kind of guy). So I was expecting some bumps along the way. 
I picked [HeroUI](https://www.heroui.com) early on, and it quickly made a difference in terms of polish. It was only towards the end when I came to applying custom styles that I started experiencing issues. I think these are mostly down to my own lack of knowledge.

[NextJS](https://nextjs.org) was a similar story. The static export is exactly what i needed. Took a while to get used to the server/client split for React.



## What went less well

### What actually is this? (aka the sequencer indecision)

Initially, I went with a Step Sequencer implementation, as it seemed to be the quickest path to having something working.

But that didn't seem to work well with playing 5/10 second video clips, so I dropped it in favour of a Time based sequencer.

You can probably tell by the current state of it, that timeline interfaces can be... nontrivial. But I managed to get something minimum and viable working. 

But, then, almost at the last moment, i had a change of heart and wanted to sequence short video clips (like drums) easily, so the Step Sequencer came back.

Common sense suggests that I should have focussed on one. It reveals that I actually didn't have a clear (enough) vision of what this actually is. Is it a drum machine, or a video player?

It would have fulfilled my original use-case to have no sequencers at all, since all i wanted was triggering of videos. But more is more right?


### Browser/OS differences

In terms of what browser/platform performs best, it's no competition - it's desktop Chrome.

In terms of video playback, Safari is actually pretty bad. Especially so on iOS - where you can only have one video playing at a time.

The big issue appears to be seek latency. When I trigger a pad on Chrome its instant. Loops sound perfect.

Other browsers have a definite stutter.

I would have liked nothing better than to have this work well on an iPhone, but for the time being its not to be.



### State

This was my first proper use of [TanStack Query](https://tanstack.com/query/latest) after hearing nothing but good things. It didn't disappoint. It took a while to get my head around the right way to structure keys and cache, but it soon clicked into place. Love it.

I'm a long term [Zustand] user, so I thought I'd give [Xstate/Store](https://stately.ai/docs/xstate-store) a spin. Generally worked out well. Was easier to structure my actions. 
I didn't like that I couldn't call events within events. And the terminology I'm still not convinced with. Not sure I would go with it again.

The nature of this app meant that I had to use a fair amount of Event driven behaviour, which is kind of against the React philosophy. I remember the bad old days before React when event driven was the way, and it was easy to get into a mess.

Fortuneatly, i didn't end up in a tangle. But I can't help but think a more [Signals](https://github.com/tc39/proposal-signals) driven approach like [Jotai](https://jotai.org) would have been a better fit.


### The Rabbit-hole of FFmpeg and Webcodecs

Originally I intended VO to have direct video manipulation capabilities. When you altered a videos duration, that would create a new video. You could add fades etc. The thought of using [FFmpeg](https://ffmpegwasm.netlify.app) in the browser seemed great.

Then I realised I could just control a players start and end, and that thumbnails could be extracted from canvas, and even fades could be done without including a 33meg Wasm blob.

I timeboxed about a day to figure out whether [WebCodecs](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API) could get me an arbitrary thumbnail. Claude and I banged our heads together and just about managed it, but even with [assistance](https://gpac.github.io/mp4box.js/) this was way too complicated. Again, I achieved the same results with the Canvas api.


### The Minor annoyances of Bun

I have been team [Bun](https://bun.sh) for a while now. Fast. But the lack of [DecompressionStream](https://github.com/oven-sh/bun/issues/1723) meant I had to drop it in favour of Pnpm. Boo.



### Actually Needing a Server After All

Having a static local first app is great, until you need to dynamically generate [OpenGraph](https://ogp.me) properties.

Having a URL with a project is great to post on social networks, less great if the preview doesn't actually show the project name or image.

So I had to cave. A bit.

Initially, I used a CloudFlare worker. This would intercept the request, parse the URL, and inject the headers. However, the free plan has limits, and it didn't sit right with me that I had to use an external service for something this fundamental.



## Conclusion

I can honestly say that I have achieved my original objective, and then some. It feels great to have shipped something that I am genuinely proud of.

Ok, it went a little over my time budget of one month, but I got far more features in than originally planned.

In terms of what's next, that does depend to an extent on whether others find value in it, and what aspects are more popular - drum machine or video player.

As an app, it's never going to be Koala Sampler or Final Cut Pro, but I do believe it has an element of fun that will keep, if not anyone else, me amused finding that perfect loop for some time.


