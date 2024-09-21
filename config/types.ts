// types.ts

export interface Tag {
    id: number;
    attributes: {
        Name: string;
    };
}

export interface ArticleContentChild {
    type: string; // e.g., "text"
    text: string; // The actual text content
}

export interface ArticleContent {
    type: string; // e.g., "paragraph"
    children: ArticleContentChild[]; // Array of content children
}

export interface ArticleImageFormats {
    thumbnail: {
        url: string;
    };
    medium: {
        url: string;
    };
    small: {
        url: string;
    };
    large: {
        url: string;
    };
}

export interface ArticleImage {
    id: number;
    attributes: {
        name: string;
        alternativeText: string | null;
        caption: string | null;
        width: number;
        height: number;
        formats: ArticleImageFormats;
        url: string;
        previewUrl: string | null;
        provider: string;
        provider_metadata: any;
        createdAt: string;
        updatedAt: string;
    };
}

export interface ThumbnailAttributes{
    
        name: string;
        alternativeText: string | null;
        caption: string | null;
        width: number;
        height: number;
        formats: ArticleImageFormats;
        url: string;
        previewUrl: string | null;
        provider: string;
        provider_metadata: any;
        createdAt: string;
        updatedAt: string;
  
}
export interface Thumbnail {
    data: {
        id: number;
        attributes: ThumbnailAttributes;
    };
}

export interface Article {
    id: number;
    attributes: {
        Title: string;
        Content: string;
        Excerpt: string;
        Date: string; // Use string to match API response (ISO string)
        Featured: boolean;
        Slug: string;
        Thumbnail: Thumbnail; // Updated Thumbnail field
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
        Images: {
            data: ArticleImage[];
        }
        tags: {
            data: Tag[];
        };
    };
}

export interface MetaPagination {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}

export interface Meta {
    pagination: MetaPagination;
}

export interface ArticlesResponse {
    data: Article[];
    meta: Meta;
}


interface ImageFormat {
    url: string;
    width: number;
    height: number;
  }
  
  interface Image {
    id: number;
    name: string;
    alternativeText: string;
    caption: string;
    width: number;
    height: number;
    formats: {
      thumbnail: ImageFormat;
      small: ImageFormat;
      medium: ImageFormat;
      large: ImageFormat;
    };
    url: string;
  }
  
  // About page data interface
export interface AboutPageData{
    data: About[];
}
 export interface About{
            id: number;
            attributes: {
                Title: string;
                Content: string;
                Image: Thumbnail; 
                CreatedAt: string;
                UpdatedAt: string;
                PublishedOn: string;
            
        };
  }
  


export interface ContactPageData{
    data: Contact[];
}
  export interface Contact {
    id: number;
   attributes:{
    Title: string;
    Address: string;
    PhoneNumber: string;
    Email: string;
    MapCoordinates: {
      lat: number;
      lng: number;
    };
    CreatedOn: string;
    FormInstructions: string;
   
   }
  }
  