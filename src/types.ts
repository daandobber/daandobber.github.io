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

export interface Artist {
	name: string;
}

export interface BasicInformation {
	title?: string;
	artists?: Artist[];
	year?: number;
	cover_image?: string;
}

export interface Release {
	id: number | string;
	basic_information?: BasicInformation;
}

export interface SortOption {
	id: string;
	label: string;
	order: 'asc' | 'desc';
	sortKey: 'artist' | 'year' | 'title';
}

export interface SiteMeta {
	title: string;
	description?: string;
	ogImage?: string;
	articleDate?: string;
}

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