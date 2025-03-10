+++
title = 'Weeknotes 004'
date = 2025-03-09T19:29:00+00:00
draft = true
weather = '10°C Cloudy'
location = '50.79°N, 3.65°W'
tags = ['weeknotes']
customcss = 'custom.css'
description = 'Week notes for the 10th week of 02025'
+++

So yes, clearly I lapsed hard and lost that weeknotes feeling. But I'm back. Honest.

In my defence, [VO Pads](https://vo.odgn.net) was all consuming. And everything else sort of fell by the wayside.

It was wonderful of course, being that focussed on a single thing. I haven't been that into a project for quite some time.

And of course, the downside is that other activities receive less focus - sleep, eating properly, interviews.
It wasn't as bad as some other ocassions in my past. I have other, wonderful, things which keep me grounded.

And the fact that there was a definite stopping point helped a great deal.

This week some fixes to the playback were applied, and I made the interval slider background stripey.

The next chunk of work is likely to make the interval slider zoomable - it's near useless when the video is long and the chosen interval is short.

---

This week I returned properly to the project codenamed Strix. What I really should have been working on.

It's always strange to return to previous work. Re-learning the original thought processes. Looking at it from a new perspective.

I have decided to reduce the scope of the project a little. It's still ambitious. But there is a definite core functionality now which will be good enough for v1.

Coming back to React Native after several care-free months of React Web has been hard. Entire mornings lost to a sudden Red Screen with non-obvious reasons. Feels brittle. I discovered that working with XML is not something RN cares for.

Going forward, I am determined to always have a current working build on my phone. I want to move to testflight quickly so that others can get it in there hands.

---

Some time this week was spent re-examining which state manager to use.

[Xstate/Store](https://stately.ai/docs/xstate-store) mostly worked out fine in the last project, but i ran up against some limitations in being able to call other actions/events from within events.

So I decided to try something else. The project started with [Zustand](https://github.com/pmndrs/zustand), but I have found it gets kind of messy organisationally.

I started with [Legend/state](https://legendapp.com/open-source/state/v3/). A bit more of signals/observable based approach.

Two things didn't work so well for me: the first is that I ran into a situation where an observable wouldn't update as expected. This may have been because I was calling it from an interval timer. But I had to use an awkward work-around.

Next, is that it seems to come batteries included with sqlite persistence that appears to conflict with op-sqlite.

So, fickle creature that I am, I decided to go with [Jotai](https://jotai.org) instead.

Similar concepts to Legend, so I still have a hill to climb to get used to the composition of individual state.


---

- One of the more serious casulaties of my recent work sprint was losing momentum on my [Person Of Interest](https://en.wikipedia.org/wiki/Person_of_Interest_(TV_series)) watch-through.

- White Lotus already seems better than the previous entries.

- Prime Target ended this week. Enjoyable Dan Brown-ish adventure.

- Severance is not something I am super enthusiastic about, but it's clearly top tier viewing.

- Did I mention that I finally watched [Wild Robot](https://en.wikipedia.org/wiki/The_Wild_Robot)? Didn't have much expectations, but it was wonderful. The opening half an hour is free of talking, much like Wall-E which I loved.


## Links of Note


#### [Max Cooper - On Being](https://maxcooper.net/on-being)

Needs more listens, but have been enjoying this a lot this week.


#### [Trip Simulator](https://github.com/billylo1/set-simulator-location-trip-simulator)

Simulating walking routes in the iOS simulator is not great DX. This tool makes it slightly easier.

Tempted to fork it to allow drag/drop of a GPX file.


#### [Screen Now](https://screen.now)

A (so far) free alternative to Screen Capture. Not quite as full featured, but has some nice things missing from SC like adding captions.


#### [Senior TV producers take shelf-stacking jobs as UK industry remains in crisis](https://www.theguardian.com/media/2025/mar/07/senior-tv-producers-shelf-stacking-jobs-uk-industry-crisis)

As someone who is currently experiencing a longer than expected paid work shortage, this hit hard.
