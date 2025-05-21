---
isDraft: true
pubDate: 2025-05-21T12:30:27.936Z
tags:
  - astro
---



In order to reduce the friction of adding new posts, I created a simple dev mode only admin page.


One part of functionality is to toggle whether a post is live or not.


to do this i had to add a server handler, which would identify the post and then rewrite it with the relevant value altered in the front matter.

the main admin page is prevented from being visible in prod by adding a redirect

```typescript
// Only allow access in dev mode
if (!import.meta.env.DEV) {
  return Astro.redirect('/404');
}
```


the problem came when attempting to build.

i reasoned that it should be possible to exclude a file from the build altogether, but apparently that is not the case with Astro.

Instead, I added a node adapter to allow a server build. This meant that the output in my dist folder was now client/ and server/

Easy enough to delete the server/ - and job done - i think?



### whatever man