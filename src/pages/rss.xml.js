import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_DESCRIPTION, SITE_TITLE } from "../consts";

export async function GET(context) {
  const culturaOnline = await getCollection("cultura-online");
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: culturaOnline.map((post) => ({
      ...post.data,
      link: `/cultura-online/${post.id}/`,
    })),
  });
}
