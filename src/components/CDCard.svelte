<script lang="ts">
	import type { Release, Artist } from "@/types";

	export let release: Release | undefined | null;

	// Als release niet is meegegeven, render dan niets.
	if (!release) {
		// In Svelte kun je conditioneel renderen met een {#if} block, zie hieronder.
	}

	function formatArtists(artists: Artist[] | undefined): string {
		if (!artists || artists.length === 0) return "Onbekende Artiest";
		return artists.map((artist: Artist) => artist.name).join(", ");
	}

	const artists = release?.basic_information?.artists
		? formatArtists(release.basic_information.artists)
		: "";
	const title = release?.basic_information?.title ?? "Geen Titel";
	const year = release?.basic_information?.year;
	const cover = release?.basic_information?.cover_image ?? "/images/placeholder-cover.png";
	const altText = `Cover van ${title} door ${artists}`;
</script>

{#if release}
	<div
		class="flex flex-col overflow-hidden rounded-lg border border-gray-300 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800"
	>
		<img
			src={cover}
			alt={altText}
			class="aspect-square h-auto w-full bg-gray-200 object-cover dark:bg-gray-600"
			loading="lazy"
			on:error={(e) => {
				(e.target as HTMLImageElement).src = "/images/placeholder-cover.png";
			}}
		/>
		<div class="flex flex-grow flex-col p-4">
			<h2 class="mb-1 line-clamp-2 text-base font-semibold" {title}>{title}</h2>
			<p class="mb-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400" title={artists}>
				{artists}
			</p>
			{#if year && year > 0}
				<p class="mt-auto pt-1 text-xs text-gray-500 dark:text-gray-500">{year}</p>
			{:else}
				<p class="mt-auto pt-1 text-xs text-gray-500 dark:text-gray-500">&nbsp;</p>
			{/if}
		</div>
	</div>
{/if}

<style>
	.line-clamp-2 {
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}
</style>
