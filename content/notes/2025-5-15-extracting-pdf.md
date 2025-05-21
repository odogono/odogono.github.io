---
title: 'Working with PDF'
pubDate: 'May 15 2025'
isDraft: false
weather: '19°C Mostly Cloudy'
location: '50.79°N, 3.65°W'
tags: ['react', 'astro', 'pdf']
---



A job I have recently is migrating an old wordpress site to Astro.

One of it's main features is that it displays a monthly PDF newsletter.

Every month I receive an email containing a PDF, which I then have to upload, extract a cover image, and then create a post for. 

It doesn't take too long, but certainly there is room for some automation.

My thinking is:

- when the Astro site is built
- scan a directory of PDFs
- extract the cover image, some relevant parts of text
- use all this to create a page


I've had some experience dealing with PDF's before - generating and filling in forms mostly. It's a gnarly format, and easy to have a bad time with.

Let's see what 2025 can bring to the party.


My LLM instance suggested that I take a look at pdf-lib to extract the text and image. 

Not a bad suggestion, but it turned out that the suggested code was wildly out of date, or just plain hallucination. pdf-lib seems to be ok for generation, not so much for extraction.

The next suggestion was pdf.js. This turned out to be a more reasonable suggestion.

The setup/import code the LLM provided though was mostly garbage. Its mostly a client side lib, but server operation is fine.
It took a fair amount of cursor conversation before it sat right - at the end of every convo was a suggestion to look at another Lib.


### Extracting the image.

My first thought was to extract the images from the first page somehow, identify the one I'm after and then write it out.
Turns out, the simpler option is simply to render the PDF page to an image.

The initial suggestion was to use node-canvas, but pdf.js did NOT like that at all.

After some searching, i found a link to a relatively new and (perhaps) immature node canvas library called @napi-rs/canvas.

Perfect. Dropped it in and worked straight away.


After that, I could simply use the canvas object to crop to a known rect for the cover image, and voila.



### Extracting the text.

If you ask pdf.js for the text content of the page, it gives you a list of objects with coordinates on the page and a string. Sometimes this string is empty. Sometimes the object dimensions are invalid. But there is no identifier for the text data.

So, my strategy was to define bounding boxes for the areas of text that I was interested in - the date, issue number, description.

And then perform a bounding box collision check against each of the text objects to get what I wanted.

The trick was converting from pixel coordinates to pdf coordinates. It's Y axis is inverted, so 0 is the bottom. The output jpeg i was working with was twice the scale by default, so that eventually was taken into consideration.

But yeah, in the end it works.