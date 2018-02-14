
// internal tag used to get the hostname from a url
const tempATag = document.createElement('a');

// return the URL to the favicon for a website domain
export function googleFavIconUrl(domain) {
  return `https://www.google.com/s2/favicons?domain=${domain}`;
}

// return our best guess for the domain name of a story
export function storyDomainName(story) {
  // use guid unless it isn't a url
  if ({}.hasOwnProperty.call(story, 'guid')) {
    tempATag.href = (story.guid.startsWith('http')) ? story.guid : story.url;
  } else {
    tempATag.href = story.url;
  }
  // get the domain without any subdomain
  const domain = tempATag.hostname.split('.').slice(-2).join('.');
  return domain;
}

export function urlToSourceManager(param) {
  return `https://sources.mediacloud.org/#/${param}`;
}

export function urlToCollection(param) {
  return urlToSourceManager(`collections/${param}`);
}

export function urlToSource(param) {
  return urlToSourceManager(`sources/${param}`);
}

export function urlToTopicMapper(param) {
  return `https://topics.mediacloud.org/#/${param}`;
}

export function urlToExplorer(param) {
  return `https://explorer.mediacloud.org/#/${param}`;
}
