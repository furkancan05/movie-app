export const getImage = (image_url: string) => {
  const baseUrl = 'https://image.tmdb.org/t/p/w500';

  return baseUrl + image_url;
};
