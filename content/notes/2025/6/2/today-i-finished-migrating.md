---
isDraft: false
pubDate: 2025-06-02T20:03:24.233Z
tags: [ "astro", "pdf", "wordpress" ]
slug: goodbye-wordpress
---


Today I finished migrating an existing Wordpress site i have been running over to [Astro](https://astro.build/).

There was nothing especially interesting about the site - [it's a basic community web site with information and contact details](https://yeoford.org). It's main feature is being able to view the monthly published PDF newsletters.

Previously I would be emailed the PDF, and then go manually go through a short workflow of extracting a cover image from the PDF in order to display it on the site. Then I would create a new post to contain the PDF, and update a few fields of metadata.

Nothing fancy, but slightly tedious.

With the new version of the site, those manual steps have been eliminated.

What I have now is a script which will read each PDF in a folder and extract from it a cover image and a few key paragraphs of text.

The extraction from the PDF itself is slightly ridiculous, but then PDF is itself an 'interesting' file format. 

In broad terms, what I ended up doing is defining bounding Rectangles onto selected pages of the document where the image or text I need exist.

Once the data is extracted, it is then placed within the sites filesystem as images or JSON, ready to be picked up by Astro for display.

Previously, the dynamic wordpress site was hosted on its own (small-ish) linode server - running nginx, PHP, and mysql.

But now, the new Astro site is entirely static, (cheekily) hosted on github pages, and fronted by Cloudflare.

Quite a reduction in resources!