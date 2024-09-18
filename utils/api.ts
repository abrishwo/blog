import axios from 'axios';
import { AboutPageData, ArticlesResponse, ContactPageData } from '../types';

export async function fetchArticles(page: number = 1, pageSize: number = 10): Promise<ArticlesResponse> {
  try {
    // const res = await axios.get('http://localhost:1337/api/articles?populate=Thumbnail', {
        // const res = await axios.get('http://localhost:1337/api/articles', {
        const res = await axios.get('http://localhost:1337/api/articles?populate=*', {
    params: {
        'pagination[page]': page,
        'pagination[pageSize]': pageSize,
      }
    });

    // Check if the data structure matches the expected format
    const data: ArticlesResponse = res.data;
    if (data && data.data) {
      return data; // Return the complete response including metadata
    } else {
      return { data: [], meta: { pagination: { page: 1, pageSize: 10, total: 0, totalPages: 1 } } }; // Return default structure if data is not in the expected format
    }
  } catch (error) {
    console.error('Error fetching articles:', error);
    return { data: [], meta: { pagination: { page: 1, pageSize: 10, total: 0, totalPages: 1 } } }; // Return default structure in case of error
  }
}


export async function fetchArticleBySlug(slug: string) {
  // const res = await fetch(`http://localhost:1337/articles?filters[Slug][$eq]=${slug}&populate=*`); 
  const res = await fetch(`http://localhost:1337/api/articles?filters[Slug][$eq]=${slug}&populate=*`);
  const data = await res.json();
  console.log(data);
  return data.data[0]; // Returning the first article found
}


// fetch about us
export async function fetchAboutUs(): Promise<AboutPageData> {
  try {
    
        const res = await axios.get('http://localhost:1337/api/abouts?populate=*');

    const data: AboutPageData = res.data;
    if (data && data.data) {
      return data; 
    } else {
      return { data: [] }; 
    }
  } catch (error) {
    console.error('Error fetching articles:', error);
    return { data: []}; // Return default structure in case of error
  }
}

// contact page
export async function fetchContactUs(): Promise<ContactPageData> {
  try {
    
        const res = await axios.get('http://localhost:1337/api/contacts?populate=*');

    const data: ContactPageData = res.data;
    if (data && data.data) {
      return data; 
    } else {
      return { data: [] }; 
    }
  } catch (error) {
    console.error('Error fetching articles:', error);
    return { data: []}; // Return default structure in case of error
  }
}
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api';

export const fetchAPI = async (path:string) => {
  const requestUrl = `${API_URL}${path}`;
  const response = await axios.get(requestUrl);
  return response.data[0];
};

