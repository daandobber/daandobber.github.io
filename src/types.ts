// src/types.ts

// --- Algemene Site Configuratie & Types ---
export interface SiteConfig {
    author: string;
    date: {
        locale: string | string[] | undefined;
        options: Intl.DateTimeFormatOptions;
    };
    description: string;
    lang: string;
    ogLocale: string;
    title: string;
    url: string;
}

export interface PaginationLink {
    srLabel?: string;
    text?: string;
    url: string;
}

// Behoud de meest complete SiteMeta definitie
export interface SiteMeta {
    articleDate?: string | undefined;
    description?: string;
    ogImage?: string | undefined;
    title: string;
}

/** Webmentions */
export interface WebmentionsFeed {
    children: WebmentionsChildren[];
    name: string;
    type: string;
}

export interface WebmentionsCache {
    children: WebmentionsChildren[];
    lastFetched: null | string;
}

export interface WebmentionsChildren {
    author: Author | null;
    content?: Content | null;
    "mention-of": string;
    name?: null | string;
    photo?: null | string[];
    published?: null | string;
    rels?: Rels | null;
    summary?: Summary | null;
    syndication?: null | string[];
    type: string;
    url: string;
    "wm-id": number;
    "wm-private": boolean;
    "wm-property": string;
    "wm-protocol": string;
    "wm-received": string;
    "wm-source": string;
    "wm-target": string;
}

export interface Author {
    name: string;
    photo: string;
    type: string;
    url: string;
}

export interface Content {
    "content-type": string;
    html: string;
    text: string;
    value: string;
}

export interface Rels {
    canonical: string;
}

export interface Summary {
    "content-type": string;
    value: string;
}

export type AdmonitionType = "tip" | "note" | "important" | "caution" | "warning";

// --- Discogs / CD Collectie Types ---
export interface Artist {
    name: string;
    // Voeg hier eventueel andere Discogs artist velden toe indien nodig
}

export interface BasicInformation {
    id: number; // Discogs ID van de release zelf
    title?: string;
    artists?: Artist[];
    year?: number;
    cover_image?: string;
    resource_url: string; // URL naar de API resource
    // Voeg hier eventueel andere Discogs basic_information velden toe
}

export interface Release {
    id: number; // Discogs ID van het item in je *collectie* (instance_id)
    instance_id: number; // Dubbel? id is meestal instance_id in /collection response
    date_added: string;
    rating: number; // Jouw rating op Discogs
    basic_information: BasicInformation; // Verwijst naar de release details
    // Voeg hier eventueel andere velden uit de Discogs collection response toe
}

// --- BoardGameGeek / Bordspel Collectie Types ---

// Status van een spel binnen jouw BGG collectie
export interface BoardGameStatus {
    own?: boolean;
    prevowned?: boolean;
    fortrade?: boolean;
    want?: boolean;
    wanttoplay?: boolean;
    wanttobuy?: boolean;
    wishlist?: boolean;
    preordered?: boolean;
    lastmodified?: string | null; // Kan null zijn of ontbreken
    // Voeg eventuele andere statusvelden toe die de API teruggeeft
}

// Hoofdinterface voor een bordspel
export interface BoardGame {
    id: string; // BGG Object ID (string)
    name: string;
    yearpublished: number | null; // Jaar van publicatie (kan null zijn)
    image?: string | null; // URL naar grote afbeelding
    thumbnail?: string | null; // URL naar thumbnail
    status: BoardGameStatus; // Jouw collectie status
    numplays: number; // Hoe vaak jij het gespeeld hebt (volgens BGG log)
    // Spelers info
    minplayers: number | null;
    maxplayers: number | null;
    best_with_players: string | null; // Suggestie bv "3" of "6+" (string!)
    // Speeltijd info (in minuten)
    playingtime: number | null; // Standaard/gemiddelde speeltijd
    minplaytime: number | null; // Specifieke minimum speeltijd
    maxplaytime: number | null; // Specifieke maximum speeltijd
    // Andere stats
    minage: number | null; // Minimum leeftijd
    weight: number | null; // Gemiddelde complexiteit/gewicht (1-5)
    // Ratings
    rating: number | null; // Jouw persoonlijke rating (0-10)
    average_rating: number | null; // Gemiddelde BGG rating (0-10)
    // Classificaties
    categories: string[]; // Array met categorie namen
    mechanics: string[]; // Array met mechanisme namen
    // Type spel
    is_expansion: boolean; // True als het een uitbreiding is
}


// --- Generieke Types (Bruikbaar voor beide collecties) ---

// Aangepaste SortOption: sortKey is nu een generieke string.
// De Svelte componenten moeten zelf weten welke keys geldig zijn.
// Alternatief: Maak aparte SortOption interfaces (bv. DiscogsSortOption, BoardGameSortOption)
// of gebruik Generics (bv. SortOption<T extends Release | BoardGame>)
export interface SortOption {
    id: string; // Unieke ID voor de sorteeroptie (bv. "artistAZ", "nameAZ")
    label: string; // Tekst voor op de knop (bv. "Artiest (A-Z)", "Naam (A-Z)")
    order: 'asc' | 'desc'; // Sorteer volgorde
    sortKey: string; // De key in het data object waarop gesorteerd wordt (bv. "basic_information.artists.0.name", "name", "weight")
}


// --- Bluesky Post Type ---
export interface BlueskyPost {
    uri: string;
    cid: string;
    author_handle: string;
    author_display_name: string;
    author_avatar: string;
    text: string;
    created_at: string; // ISO 8601 string
    likes: number;
    reposts: number;
    replies: number;
    embeds?: {
      type: 'images' | string;
      images?: { thumb: string; fullsize: string; alt: string }[];
    } | null;

  }

  export interface SteamGame {
	id: number;
	name: string;
	image?: string | null;
	thumbnail?: string | null;
	release_date?: string | null;
	developers?: string[] | null;
	publishers?: string[] | null;
	metacritic_score?: number | null;
	genres?: string[] | null;
	categories?: string[] | null;
	achieved_count: number;
	total_achievements: number;
	achievement_percentage: number | null;
	last_achievement_unlock_time: number;
	last_achievement_name: string | null;
	last_achievement_icon: string | null;
}