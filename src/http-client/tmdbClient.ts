import axios, { AxiosRequestConfig } from 'axios';

interface TMDBParams {
  append_to_response?: string;
  with_genres?: number;
  sort_by?: string;
  page?: number;
  'vote_count.gte'?: number;
  external_source?: string;
  [key: string]: any;
}

interface TMDBConfig extends AxiosRequestConfig {
  params?: TMDBParams;
}

export const tmdbClient = {
  get: async <T>(url: string, config?: TMDBConfig): Promise<T> => {
    const response = await axios.get<T>(
      `https://api.themoviedb.org/3${url}`,
      {
        ...config,
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
        },
      }
    );
    return response.data;
  }
};

export type TMDBResponse<T> = T; 