// Example usage in a component

import { About, Article, ArticleImage } from '../types';

// Function to get thumbnail URL
// export const getThumbnailUrl = (article: Article): string | undefined => {
//     return article.attributes.Thumbnail.data.attributes.formats.thumbnail.url;
// };
const BASE_URL = 'http://localhost:1337'; 
export const getThumbnailUrl = (article: Article): string | undefined => {
    const thumbnail = article.attributes.Thumbnail.data.attributes.formats.thumbnail.url;
    return `${BASE_URL}${thumbnail}`;
};

export const getArticleGalleryImageUrl = (image: ArticleImage): string | undefined => {
    const imageUrl = image.attributes.url;
    return `${BASE_URL}${imageUrl}`;
};

export const getAboutThumbnailUrl = (about: About): string | undefined => {
    const thumbnail = about.attributes.Image.data.attributes.formats.thumbnail.url;
    return `${BASE_URL}${thumbnail}`;
};