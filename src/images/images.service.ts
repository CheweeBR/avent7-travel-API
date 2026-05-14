import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createApi } from 'unsplash-js';
import { createClient } from 'pexels';
import * as nodeFetch from 'node-fetch';

export interface ImageResult {
  id: string;
  urlThumb: string;
  urlRegular: string;
  alt: string;
  photographer: string;
  photographerUrl: string;
  source: 'unsplash' | 'pexels';
}

export interface ImageSearchResponse {
  results: ImageResult[];
  total: number;
  source: 'unsplash' | 'pexels';
}

@Injectable()
export class ImagesService {
  private readonly logger = new Logger(ImagesService.name);

  constructor(private readonly config: ConfigService) {}

  async searchImages(q: string, page = 1, perPage = 3): Promise<ImageSearchResponse> {
    try {
      const result = await this.searchUnsplash(q, page, perPage);
      if (result.results.length > 0) return result;
    } catch (err) {
      this.logger.warn(`Unsplash failed, falling back to Pexels: ${(err as Error).message}`);
    }

    return this.searchPexels(q, page, perPage);
  }

  private async searchUnsplash(q: string, page: number, perPage: number): Promise<ImageSearchResponse> {
    const accessKey = this.config.get<string>('UNSPLASH_ACCESS_KEY');
    if (!accessKey) throw new Error('UNSPLASH_ACCESS_KEY not configured');

    const unsplash = createApi({ accessKey, fetch: nodeFetch.default as unknown as typeof fetch });
    const response = await unsplash.search.getPhotos({ query: q, page, perPage });

    if (response.errors) throw new Error(response.errors.join(', '));

    const results: ImageResult[] = (response.response?.results ?? []).map((photo) => ({
      id: photo.id,
      urlThumb: photo.urls.thumb,
      urlRegular: photo.urls.regular,
      alt: photo.alt_description ?? photo.description ?? q,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
      source: 'unsplash',
    }));

    return { results, total: response.response?.total ?? 0, source: 'unsplash' };
  }

  private async searchPexels(q: string, page: number, perPage: number): Promise<ImageSearchResponse> {
    const apiKey = this.config.get<string>('PEXELS_API_KEY');
    if (!apiKey) throw new Error('PEXELS_API_KEY not configured');

    const client = createClient(apiKey);
    const response = await client.photos.search({ query: q, page, per_page: perPage });

    if ('error' in response) throw new Error(response.error as string);

    const results: ImageResult[] = response.photos.map((photo) => ({
      id: String(photo.id),
      urlThumb: photo.src.tiny,
      urlRegular: photo.src.large,
      alt: photo.alt ?? q,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
      source: 'pexels',
    }));

    return { results, total: response.total_results, source: 'pexels' };
  }
}
