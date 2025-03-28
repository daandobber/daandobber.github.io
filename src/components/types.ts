// src/types.ts
export interface Artist {
  name: string;
  // Add other potential artist fields if needed
}

export interface BasicInformation {
  title?: string;
  artists?: Artist[];
  year?: number;
  cover_image?: string;
  // Add other potential basic_information fields if needed
}

export interface Release {
  id: number | string; // Discogs uses number, but be flexible
  basic_information?: BasicInformation;
  // Add other potential top-level release fields if needed
}

// Type for Sort Options (used in cd-collectie.astro)
export interface SortOption {
  id: string;
  label: string;
  order: 'asc' | 'desc';
  valueFn: (item: Release) => string | number; // Function extracting sort value from a Release
}