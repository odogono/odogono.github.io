interface LinkMetadata {
  description: string | null;
  image: string | null;
  siteName: string | null;
  title: string;
}

export const getLinkMetadata = async (
  url: string
): Promise<LinkMetadata | null> => {
  try {
    // Try multiple CORS proxies in case one fails
    const proxies = [
      `https://cors-anywhere.herokuapp.com/${url}`,
      `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
      `https://corsproxy.io/?${encodeURIComponent(url)}`
    ];

    let response = null;
    let html = '';

    // Try each proxy until one works
    for (const proxy of proxies) {
      try {
        response = await fetch(proxy, {
          headers: {
            Origin: window.location.origin
          }
        });
        if (response.ok) {
          html = await response.text();
          break;
        }
      } catch {
        continue;
      }
    }

    if (!html) {
      throw new Error('Failed to fetch metadata from any proxy');
    }

    // Create a temporary DOM element to parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Extract metadata
    const title =
      doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
      doc.querySelector('title')?.textContent ||
      url;

    const description =
      doc
        .querySelector('meta[property="og:description"]')
        ?.getAttribute('content') ||
      doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
      null;

    const image =
      doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
      doc
        .querySelector('meta[name="twitter:image"]')
        ?.getAttribute('content') ||
      null;

    const siteName =
      doc
        .querySelector('meta[property="og:site_name"]')
        ?.getAttribute('content') || new URL(url).hostname;

    return {
      description,
      image,
      siteName,
      title
    };
  } catch {
    return null;
  }
};
