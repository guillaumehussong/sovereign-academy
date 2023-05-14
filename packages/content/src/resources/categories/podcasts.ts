import { firstRow } from '@sovereign-academy/database';
import { Resource } from '@sovereign-academy/types';

import { ChangedResource } from '..';
import { Dependencies } from '../../dependencies';
import { separateContentFiles, yamlToObject } from '../../utils';
import { createProcessMainFile } from '../main';

/** Base podcast information, same for all translations */
interface PodcastMain {
  /** Name of the podcast */
  name: string;
  /** Name of the host */
  host: string;
  description: string;
  links: {
    website: string;
    twitter?: string;
    podcast?: string;
    nostr?: string;
  };
}

export const createProcessChangedPodcast = (dependencies: Dependencies) => {
  const { postgres } = dependencies;

  return async (resource: ChangedResource) => {
    return postgres.begin(async (transaction) => {
      const processMainFile = createProcessMainFile(transaction);

      const { main } = separateContentFiles(resource, 'builder.yml');

      await processMainFile(resource, main);

      const id = await transaction<Resource[]>`
          SELECT id FROM content.resources WHERE path = ${resource.path}
        `
        .then(firstRow)
        .then((row) => row?.id);

      if (!id) {
        throw new Error('Resource not found');
      }

      if (main) {
        const parsed = yamlToObject<PodcastMain>(main.data);

        await transaction`
          INSERT INTO content.podcasts (
            resource_id, name, host, description website_url, twitter_url, podcast_url, nostr
          )
          VALUES (
            ${id}, ${parsed.name}, ${parsed.host}, ${parsed.description}, ${parsed.links.website}, 
            ${parsed.links.twitter}, ${parsed.links.podcast}, ${parsed.links.nostr}
          )
          ON CONFLICT (resource_id) DO UPDATE SET
            name = EXCLUDED.name,
            host = EXCLUDED.host,
            description = EXCLUDED.description,
            website_url = EXCLUDED.website_url,
            twitter_url = EXCLUDED.twitter_url,
            podcast_url = EXCLUDED.podcast_url,
            nostr = EXCLUDED.nostr
        `;
      }
    });
  };
};
