---
title: 'Notes on moving to Astro'
pubDate: 'May 14 2025'
isDraft: true
weather: '15°C Clear'
location: '50.79°N, 3.65°W'
tags: ['react', 'astro']
description: 'Some notes on moving from Hugo to Astro'
---




## Things that are missing from Hugo

- tags and handling of tags
- draft status




a default image for a blog post

we can specify a heroImage for each blog post, but if there isn't one what can we do



### Styling of Code Blocks

Astro has a built-in syntax highlighter - Shiki - however nothing was changing for me when switching between light and dark themes.

running
```bash
bun dev --force
```
cleared the data cache


```typescript
const msg = `hello world`;
console.log(msg + '!');
```


> Speaking of the effects of technology on individuals and society as a whole, Marshall McLuhan wrote that every augmentation is also an amputation. [...] Today, quite suddenly, billions of people have access to AI systems that provide augmentations, and inflict amputations, far more substantial than anything McLuhan could have imagined. This is the main thing I worry about currently as far as AI is concerned.