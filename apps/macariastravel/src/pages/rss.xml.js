import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');
  const routes = await getCollection('routes');
  const videos = await getCollection('videos');

  const allContent = [...posts, ...routes, ...videos].sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  return rss({
    title: 'Macarias Travel',
    description: 'Vive y escribe tu historia - Blog de montana, rutas y viajes de aventura',
    site: context.site,
    items: allContent.map((item) => ({
      title: item.data.title,
      pubDate: item.data.pubDate,
      description: item.data.description,
      link: item.collection === 'blog'
        ? `/blog/${item.id}/`
        : item.collection === 'routes'
          ? `/rutas/${item.id}/`
          : `/videos/${item.id}/`,
    })),
    customData: '<language>es-es</language>',
  });
}
