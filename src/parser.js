const parse = (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'text/xml');
  const errorNode = doc.querySelector('parsererror');

  if (errorNode) {
    throw new Error('invalidRSS');
  }

  const channel = doc.querySelector('channel');
  if (!channel) {
    throw new Error('invalidRSS');
  }

  const feedTitle = channel.querySelector('title')?.textContent || 'No title';
  const feedDescription = channel.querySelector('description')?.textContent || 'No description';
  const feed = { title: feedTitle, description: feedDescription };

  const items = channel.querySelectorAll('item');
  const posts = Array.from(items).map((item) => {
    const title = item.querySelector('title')?.textContent || 'No title';
    const description = item.querySelector('description')?.textContent || 'No description';
    const url = item.querySelector('link')?.textContent || '#';
    return { title, description, url };
  });

  return { feed, posts };
};

export default parse;
