import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_DESCRIPTION, SITE_TITLE } from "../consts";

export async function GET(context) {
  const cultura = await getCollection("cultura");
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: cultura.map((post) => ({
      ...post.data,
      link: `/cultura/${post.id}/`,
    })),
  });
}
