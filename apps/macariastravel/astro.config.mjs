// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { visit } from 'unist-util-visit';

function remarkYouTubeEmbed() {
  return (tree) => {
    visit(tree, 'image', (node) => {
      const url = node.url;
      const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
      if (match) {
        const videoId = match[1];
        node.type = 'html';
        node.value = `<div class="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-stone-900 my-8">
          <iframe
            src="https://www.youtube-nocookie.com/embed/${videoId}"
            title="${node.alt || 'Video'}"
            class="absolute inset-0 w-full h-full"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>`;
      }
    });
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://macariastravel.com',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [mdx(), sitemap()],
  markdown: {
    remarkPlugins: [remarkYouTubeEmbed]
  },
  output: 'static'
});