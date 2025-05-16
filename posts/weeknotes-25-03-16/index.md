---
title: 'Weeknotes 005'
pubDate: 2025-03-16T18:06:00+00:00
isDraft: false
weather: '2°C Clear'
location: '50.79°N, 3.65°W'
tags: ['weeknotes']
customcss: 'custom.css'
description: 'Week notes for the 11th week of 02025'
---


This week dev has mostly been about implementing authentication, both app and server side. Because I am now at a point where the app is able to send data to the server.

The first step was server side. And by server I mean both Web front-end and API.

I have elected to go with [Elixir](https://elixir-lang.org) for this project. I have done a fair amount of it in the past, but not so much in recent years, so it has taken a while to recall the way of doing things.

Because I wanted to use React for the web front-end, [LiveView](https://hexdocs.pm/phoenix_live_view/Phoenix.LiveView.html) was not such an attractive option. Instead I have opted to use [Inertia](https://inertiajs.com) to bridge between Phoenix and React. It appears to be quite oriented towards Laravel, but there is an [adapter](https://github.com/inertiajs/inertia-phoenix).

Implementing Apple and Google sign-in was mostly straightforward. Using the same authentication for the API hit a few stumbling blocks with quite poor library documentation, which wasn't spelling out exactly the steps required, but I got there in the end.

In the app, [Expo had me covered for Apple](https://docs.expo.dev/versions/latest/sdk/apple-authentication/), and for google a non-expo library, which rather worryingly warns that the [free version will stop working later in the year](https://react-native-google-signin.github.io/docs/install#public-version-free).


---

Again docker made my life a misery this week. In particular this little line of joy which hung the build completely.

```bash
[debug] Downloading esbuild from https://registry.npmjs.org/@esbuild/linux-arm64/0.17.11
```

turns out the cause of this was in mix.exs, in particular the assets.build and assets.deploy.

when i have:

```
"assets.deploy": [
  "tailwind default --minify",
  "esbuild default --minify",
  "phx.digest"
]
```

it hangs.

But changing it to the package name works.

```
"assets.deploy": [
  "tailwind strix_server --minify",
  "esbuild strix_server --minify",
  "phx.digest"
]
```

I have no idea why it was set to default to begin with.


---

The week ended with deploying the app release build onto iOS and failing with a cryptic 'Maximum update depth exceeded' error, despite working without issue as dev builds. So now begins the slow process of disabling lines one by one.
App dev can be so insanely fragile sometimes.

---


A lot of online discussion this week about ['Vibe coding'](https://www.youtube.com/watch?v=Pb6RYlRtEEA&t=3084s). [This talk](https://www.youtube.com/watch?v=IACHfKmZMr8&t=266s) was fairly excruciating.

Even though I use an LLM quite a lot, it's still done with a tight knot in my stomach waiting to see whether it has decided to delete half my code, or got confused and started using a totally different framework. That's a vibe for sure. Certainly not relaxing.


---


In minor trivia, mac Spotlight Search again became unable to recall any of my apps.

So in disgust, I installed [Raycast](https://www.raycast.com) and now i feel incredibly stupid for not doing so earlier.

I'm using the [free version](https://www.raycast.com/pricing), which does everything I need. Being able to calculate time differences ( November 2025 - March 2025 ) is wonderful


---

## Links of Note

#### [Describer](https://github.com/apideck-libraries/describer/tree/main)

Simon Willison wrote a very informative post on [how he uses LLMs to write code](https://simonwillison.net/2025/Mar/11/using-llms-for-code/).

In particular he described a technique for generated a document about how a given codebase works.

I tried it out myself, and the results were... not great. This tool appears to wrap the same process.
