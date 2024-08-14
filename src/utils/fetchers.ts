import {
  CastDetail,
  CastMovies,
  CastResponse,
  CategoryResponse,
  MovieDetail,
  MovieImages,
  MovieResponse,
  SearchResponse,
} from "@/src/types/api.types";

interface FetchParams extends RequestInit {
  url: string;
  queries?: Record<string, string>;
}

class Api {
  private baseURL = "https://api.themoviedb.org/3/";

  private prepareHeaders = (headers: Record<string, string>) => {
    return {
      ...headers,
    };
  };

  private prepareQueries = (queries: Record<string, string> | undefined) => {
    const queryObj = {
      api_key: "008f5f813391f494def03a37c01c9252",
      ...queries,
    };
    const queryString = new URLSearchParams(queryObj);

    return "?" + queryString.toString();
  };

  private call = async <T>({
    url,
    method,
    body,
    headers,
    queries,
  }: FetchParams): Promise<T> => {
    const response: T = await fetch(
      this.baseURL + url + this.prepareQueries(queries),
      {
        method,
        headers: this.prepareHeaders(headers as Record<string, string>),
        body: JSON.stringify(body),
      }
    ).then(async (res) => await res.json());

    return response;
  };

  public getCategories = async () => {
    const response = await this.call<CategoryResponse>({
      url: "genre/movie/list",
      method: "GET",
    });

    return response.genres;
  };

  public getNowPlaying = async ({
    language,
    page,
  }: {
    language: string;
    page?: number;
  }) => {
    const response = await this.call<MovieResponse>({
      url: "movie/now_playing",
      method: "GET",
      headers: { language },
      queries: { ...(page ? { page: page.toString() } : {}) },
    });

    return response;
  };

  public getPopularMovies = async ({
    language,
    page,
  }: {
    language: string;
    page?: number;
  }) => {
    const response = await this.call<MovieResponse>({
      url: "movie/popular",
      method: "GET",
      headers: { language },
      queries: { ...(page ? { page: page.toString() } : {}) },
    });

    return response;
  };

  public getTopRatedMovies = async ({
    language,
    page,
  }: {
    language: string;
    page?: number;
  }) => {
    const response = await this.call<MovieResponse>({
      url: "movie/top_rated",
      method: "GET",
      headers: { language },
      queries: { ...(page ? { page: page.toString() } : {}) },
    });

    return response;
  };

  public getUpcomingMovies = async ({
    language,
    page,
  }: {
    language: string;
    page?: number;
  }) => {
    const response = await this.call<MovieResponse>({
      url: "movie/upcoming",
      method: "GET",
      headers: { language },
      queries: { ...(page ? { page: page.toString() } : {}) },
    });

    return response;
  };

  public getMovieDetail = async ({
    language,
    movieId,
  }: {
    language: string;
    movieId: number;
  }) => {
    const response = await this.call<MovieDetail>({
      url: `movie/${movieId}`,
      method: "GET",
      headers: { language },
    });

    return response;
  };

  public getMovieCast = async ({
    language,
    movieId,
  }: {
    language: string;
    movieId: number;
  }) => {
    const response = await this.call<CastResponse>({
      url: `movie/${movieId}/credits`,
      method: "GET",
      headers: { language },
    });

    return response.cast;
  };

  public getSearchedMovies = async ({
    language,
    query,
    page,
  }: {
    language: string;
    query: string;
    page?: number;
  }) => {
    const response = await this.call<SearchResponse>({
      url: `search/movie`,
      method: "GET",
      headers: { language },
      queries: {
        query: query,
        language: language,
        ...(page ? { page: page.toString() } : {}),
      },
    });

    return response;
  };

  public getMovieImages = async ({ movieId }: { movieId: number }) => {
    const response = await this.call<MovieImages>({
      url: `movie/${movieId}/images`,
      method: "GET",
    });

    return response;
  };

  public getSimilarMovies = async ({
    movieId,
    language,
  }: {
    movieId: number;
    language: string;
  }) => {
    const response = await this.call<SearchResponse>({
      url: `movie/${movieId}/similar`,
      method: "GET",
      queries: { language: language },
    });

    return response;
  };

  public getCastDetail = async ({
    castId,
    language,
  }: {
    castId: number;
    language: string;
  }) => {
    const response = await this.call<CastDetail>({
      url: `person/${castId}`,
      method: "GET",
      queries: { language: language },
    });

    return response;
  };

  public getCastMovies = async ({
    castId,
    language,
  }: {
    castId: number;
    language: string;
  }) => {
    const response = await this.call<CastMovies>({
      url: `person/${castId}/movie_credits`,
      method: "GET",
      queries: { language: language },
    });

    return response;
  };
}

const api = new Api();
export default api;
