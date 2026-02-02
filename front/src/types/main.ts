export interface Artist {
    id: string;
    name: string;
    twitter: string;
    instagram: string;
    shop: string;
  }

export interface ArtistData {
artist: Artist[];
images: string[];
}

export interface ArtistLinks {
  twitter: string;
  instagram: string;
  shop: string;
}