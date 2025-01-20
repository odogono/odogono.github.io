+++
title = 'Weeknotes 002'
date = 2025-01-19T11:03:00+00:00
draft = false
weather = '4°C Cloudy'
location = '50.79°N, 3.65°W'
tags = ['weeknotes']
customcss = 'custom.css'
description = 'Week notes for the week ending 19th January 02025'
+++


This week was dedicated entirely to the vidpad project - an experiment which has turned into something i want to ship in some form or another.

As usual the mood has veered from "this is crappy" to "actually, its quite fun". Regardless, i am determined to see it through to some sort of conclusion.

A fair amount of time was dedicated to getting the Youtube player to do something it doesn't naturally want to do. With some careful application of state machines and careful management, it just about works.

Another important milestone was getting the import and export nailed. Its possible to recreate projects purely from a URL now, which is great as I don't want this to initially have any server requirements.
So sharing creations is trivial. I do love URLs.

As the codebase size has increased, so the familiar growing pains have increased. It's not particularly pretty in come parts. I've had to rely on events a lot more, which always feels dirty in a React app.

This is also the first time i've used [Tanstack Query](https://tanstack.com/query) in any serious way, and so far it has impressed. I don't have any server interactions, but do have a number of local db interactions, all of which i've wrapped in queries. Once I got my head around invalidating correctly, it worked very well.




## Links of Note


#### [React Scan](https://github.com/aidenybai/react-scan)

A tool which highlights components that need to be optimised


#### [Hex.Dance](https://hex.dance)

A binary/file analysis, hex dump viewer & editor in the browser.


#### [Downloading every video for a TikTok account](https://til.simonwillison.net/tiktok/download-all-videos)

An excellent write-up. I need to investigate [Whisper](https://pypi.org/project/mlx-whisper/) for transcript generation.



#### [Oodles of O's](https://www.youtube.com/watch?v=NQFRmDgBwcg)

One of my top De La Soul tracks gets a video after 33 years. It has a lovely postscript explaining the videos origin. Three Feet high and Rising was one of my first hip-hop loves.


#### [Savoury Midwestern Buns](https://www.seriouseats.com/bierocks-recipe-8775361)

A recipe to try out. Haven't come across these before.


#### [Radicle](https://radicle.xyz)

Recent github outages reminded everyone how centralised and fragile our source code could be. If I was so minded, i would probably deploy something like this on my own servers.


#### [Rhythm Doggo](https://nifflas.itch.io)

A rhythm platformer with adaptive music. And a dog.


#### [The Magical World of Shaders](https://blog.maximeheckel.com/posts/the-magical-world-of-particles-with-react-three-fiber-and-shaders/)

Bookmarked this as I have an upcoming task to get particle effects in a game I'm writing.

#### [Five Years of RN @ Shopify](https://shopify.engineering/five-years-of-react-native-at-shopify)

Interesting to read. Dedicated Native devs (or knowledge) for an app at scale is indeed essential. My last place had teams dedicated to iOS and Android. Fortuneatly we also had a dedicated upgrade resource haha.


#### [Powerdrift Arcade](https://www.playemulator.io/classic-arcade-online/power-drift/)

I'm quite obsessed with this game. The extreme sprite scaling, and the music. Ports to other systems were usually pale in comparison. Super hard to find a good emulation solution. And then, all of a sudden, in the browser.