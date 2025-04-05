<script lang="ts">
	import type { Release, Artist } from '@/types';

	export let view: 'grid' | 'list' = 'grid';
	export let release: Release | undefined | null;

	function formatArtists(artists: Artist[] | undefined): string {
		if (!artists || artists.length === 0) return 'Onbekende Artiest';
		return artists.map((artist: Artist) => artist.name).join(', ');
	}

	const artists = release?.basic_information?.artists ? formatArtists(release.basic_information.artists) : '';
	const title = release?.basic_information?.title ?? 'Geen Titel';
	const year = release?.basic_information?.year;
	const placeholderImg = '/images/placeholder-cover.png';
	const cover = release?.basic_information?.cover_image ?? placeholderImg;
	const altText = `Cover van ${title} door ${artists}`;
	const releaseId = release?.basic_information?.id;
	const discogsLink = releaseId ? `https://www.discogs.com/release/${releaseId}` : '#';

</script>

{#if release}
	{#if view === 'grid'}
        <a href={discogsLink} target="_blank" rel="noopener noreferrer"
            class="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-300 bg-white shadow-md transition-shadow duration-200 ease-in-out hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-offset-gray-900"
            aria-label={`Bekijk ${title} op Discogs`}>
            <div class="aspect-square w-full flex-shrink-0 overflow-hidden bg-gray-200 dark:bg-gray-600">
                <img src={cover} alt={altText} loading="lazy" width="200" height="200"
                    class="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                    on:error={(e: Event) => { const target = e.target as HTMLImageElement; if (target) { target.src = placeholderImg; } }} />
            </div>
            <div class="flex flex-grow flex-col p-4">
                <h2 class="mb-1 line-clamp-2 text-base font-semibold text-gray-900 dark:text-gray-100" title={title}>{title}</h2>
                <p class="mb-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400" title={artists}>{artists}</p>
                {#if year && year > 0}
                    <p class="mt-auto pt-1 text-xs text-gray-500 dark:text-gray-500">{year}</p>
                {:else}
                    <p class="mt-auto pt-1 text-xs text-gray-500 dark:text-gray-500">&nbsp;</p>
                {/if}
            </div>
        </a>
	{:else}
        <a href={discogsLink} target="_blank" rel="noopener noreferrer"
            class="group grid h-full grid-cols-[auto_1fr] items-center gap-x-3 overflow-hidden rounded-lg border border-gray-300 bg-white p-2 shadow-md transition-shadow duration-200 ease-in-out hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-offset-gray-900"
            aria-label={`Bekijk ${title} op Discogs`}>
            <div class="h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-gray-200 dark:bg-gray-600">
                 <img src={cover} alt={altText} loading="lazy" width="100" height="100"
                    class="h-full w-full object-cover"
                    on:error={(e: Event) => { const target = e.target as HTMLImageElement; if (target) { target.src = placeholderImg; } }} />
            </div>
            <div class="min-w-0">
                <h2 class="truncate text-sm font-semibold text-gray-900 dark:text-gray-100" title={title}>{title}</h2>
                <p class="truncate text-xs text-gray-600 dark:text-gray-400" title={artists}>{artists}</p>
                {#if year && year > 0}
                    <p class="text-xs text-gray-500 dark:text-gray-500">{year}</p>
                {/if}
            </div>
        </a>
	{/if}
{/if}

<style>
	.line-clamp-2 { overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; line-clamp: 2; }
    .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	a { text-decoration: none; color: inherit; }
</style>